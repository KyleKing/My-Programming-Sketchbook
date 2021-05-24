"""Example working with PyParsing and async for log parsing.

```sh
cd Assorted_Snippets
poetry run python python/parallel_programming/log_parsing.py
```

Resource Links:

- generators: https://masnun.com/2015/11/13/python-generators-coroutines-native-coroutines-and-async-await.html
- async queue: https://realpython.com/async-io-python/#using-a-queue
- cheat sheet for async: https://www.pythonsheets.com/notes/python-asyncio.html
- async-files: https://pypi.org/project/async-files (Fork of aiofiles)
- async stdlib: https://asyncstdlib.readthedocs.io/en/latest/_modules/asyncstdlib/itertools.html
- timeit: https://docs.python.org/3/library/timeit.html
- pyparsing performance advice:
    - https://codereview.stackexchange.com/questions/167445/parsing-a-file-using-pyparsing
    - https://stackoverflow.com/questions/7233891/pyparsing-performance-tips-for-parallel-logs-processing
    - https://stackoverflow.com/questions/3406544/parsing-snort-logs-with-pyparsing

Parse system logs for more complex demos (i.e. "/private/var/log/system.log"):
    https://www.howtogeek.com/356942/how-to-view-the-system-log-on-a-mac/

- System Log Folder: /var/log
- System Log: /var/log/system.log
- Mac Analytics Data: /var/log/DiagnosticMessages
- System Application Logs: /Library/Logs
- System Reports: /Library/Logs/DiagnosticReports
- User Application Logs: ~/Library/Logs (in other words, /Users/NAME/Library/Logs)
- User Reports: ~/Library/Logs/DiagnosticReports (in other words, /Users/NAME/Library/Logs/DiagnosticReports)

Planned Parser Logic:

* Step 1: Generator line reader returns each single or multiline "log entry"
* Step 2: Yielded log entry is passed to a parser that uses regex, pyparsing, or other method
    * (Could be an intermediary step to assign task based on format for performance)
    * All output is then stored in a database such as sqlite (For performance, could collect and write in batches)

"""

import asyncio
import string
import time
from pathlib import Path
from typing import Callable

from async_files import FileIO
from asyncstdlib.builtins import enumerate as async_enumerate
from loguru import logger
from pyparsing import (Combine, Group, ParseException, Suppress, Word, alphas,
                       dblQuotedString, delimitedList, nums, removeQuotes)


def _get_cmd_fields(_s, _loc, tokens) -> None:  # noqa
    """Split the cmd into the three relevant token components. Updates tokens in-place."""
    tokens['method'], tokens['request_uri'], tokens['protocol_version'] = tokens[0].strip('"').split()


def _create_log_line_bnf():  # noqa: D103
    """Create the PEG for each line in the log file. Returns a pyparsing expression.

    Heavily based on an http log parser by Paul McGuire

    https://github.com/pyparsing/pyparsing/blob/master/examples/httpServerLogParser.py

    """
    integer = Word(nums)
    ip_address = delimitedList(integer, '.', combine=True)

    time_zone_offset = Word('+-', nums)
    month = Word(string.ascii_uppercase, string.ascii_lowercase, exact=3)
    server_date_time = Group(  # noqa: ECE001
        Suppress('[')
        + Combine(integer + '/' + month + '/' + integer + ':' + integer + ':' + integer + ':' + integer)
        + time_zone_offset
        + Suppress(']'),
    )

    return (  # noqa: ECE001
        ip_address.setResultsName('ip_addr')
        + Suppress('-')
        + ('-' | Word(alphas + nums + '@._')).setResultsName('auth')
        + server_date_time.setResultsName('timestamp')
        + dblQuotedString.setResultsName('cmd').setParseAction(_get_cmd_fields)
        + (integer | '-').setResultsName('status_code')
        + (integer | '-').setResultsName('num_bytes_sent')
        + dblQuotedString.setResultsName('referrer').setParseAction(removeQuotes)
        + dblQuotedString.setResultsName('client_sfw').setParseAction(removeQuotes)
    )


LOG_LINE_BNF = _create_log_line_bnf()

BNF_TEST_DATA = [
    ('195.146.134.15 - - [20/Jan/2003:08:55:36 -0800] "GET /path/to/page.html HTTP/1.0" 200 4649'
     ' "http://www.somedomain.com/020602/page.html" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"'),
    ('111.111.111.11 - - [16/Feb/2004:04:09:49 -0800] "GET /ads/redirectads/336x280redirect.htm HTTP/1.1" 304 -'
     ' "http://www.foobarp.org/theme_detail.php?type=vs&cat=0&mid=27512" "Mozilla/4.0 (compatible; MSIE 6.0; Windows'
     ' NT 5.1)"'),
    ('11.111.11.111 - - [16/Feb/2004:10:35:12 -0800] "GET /ads/redirectads/468x60redirect.htm HTTP/1.1" 200 541'
     ' "http://11.11.111.11/adframe.php?n=ad1f311a&what=zone:56" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)'
     ' Opera 7.20  [ru\"]"'),
    ('127.0.0.1 - u.surname@domain.com [12/Sep/2006:14:13:53 +0300] "GET /skins/monobook/external.png HTTP/1.0" 304 -'
     ' "http://wiki.mysite.com/skins/monobook/main.css" "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.6)'
     ' Gecko/20060728 Firefox/1.5.0.6"'),
]


def _parse_line_bnf(line: str, write_log: bool = False):  # noqa: D103
    """Parse a single line in BNF format."""
    fields = LOG_LINE_BNF.parseString(line)
    if write_log:
        logger.debug('fields.dump(): {fields}\n', fields=fields.dump())
    # > logger.debug('repr(fields)', repr(fields))
    # > for key in fields.keys():
    # >     logger.debug(f'fields[{key}] = {fields[key]}')


def _gen_read_lines_sync(path_log: Path) -> None:
    """Yield lines from the specified log file."""
    with open(path_log, mode='r') as _f:
        for line in _f.readlines():
            if line:
                yield line


async def _gen_read_lines_async(path_log: Path) -> None:
    """Yield lines from the specified log file asynchronously."""
    async with FileIO(path_log, mode='r') as f:
        async for line in f:
            if line:
                yield line


def main_sync(path_log: Path, parse_f: Callable[[str, bool], None]) -> None:  # noqa
    """Main function for synchronous parsing of the log file."""
    logger.debug(f'SYNC-Parsing: {path_log}')
    try:
        for index, line in enumerate(_gen_read_lines_sync(path_log)):
            parse_f(line, write_log=index < 1)
    except ParseException:
        logger.exception(f'Failed to parse: {path_log}. Skipping')


async def main_async(path_log: Path, parse_f: Callable[[str, bool], None]) -> None:  # noqa
    """Main function for synchronous parsing of the log file."""
    logger.debug(f'ASYNC-Parsing: {path_log}')
    try:
        async for index, line in async_enumerate(_gen_read_lines_async(path_log)):
            parse_f(line, write_log=index < 1)
    except ParseException:
        logger.exception(f'Failed to parse: {path_log}. Skipping')


def time_control(path_log: Path) -> float:
    """Time the processing time for the synchronous approach."""
    def vapor(line, write_log):
        pass

    start = time.perf_counter()
    main_sync(path_log, vapor)
    return time.perf_counter() - start


def time_sync(path_log: Path) -> float:
    """Time the processing time for the synchronous approach."""
    start = time.perf_counter()
    main_sync(path_log, _parse_line_bnf)
    return time.perf_counter() - start


async def time_async(path_log: Path) -> float:
    """Time the processing time for the synchronous approach."""
    start = time.perf_counter()
    await main_async(path_log, _parse_line_bnf)
    return time.perf_counter() - start


if __name__ == '__main__':
    """Run as a script file to test. See snippet at top."""
    dir_log = Path(__file__).resolve().parent / 'log'
    path_log_bnf = dir_log / 'bnf.log'

    loop = asyncio.get_event_loop()
    for scalar in [50, 5000]:
        path_log_bnf.write_text('\n'.join(BNF_TEST_DATA * scalar))

        con_elapsed = time_control(path_log_bnf)
        sync_elapsed = time_sync(path_log_bnf)
        async_elapsed = loop.run_until_complete(time_async(path_log_bnf))

        logger.info(f'time_control({scalar}): {con_elapsed:0.2f}')  # (500) ~0.00 (this is a CPU-limited process)
        logger.info(f'time_sync({scalar}): {sync_elapsed:0.2f}')  # (500) ~1.12s
        logger.info(f'time_async({scalar}): {async_elapsed:0.2f}')  # (500) ~1.52s (Slower)

    # FYI: async is always slower even when the file becomes very large (4 * 50000 lines)

    loop.close()
