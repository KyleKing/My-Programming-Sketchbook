"""Example working with PyParsing and async for log parsing.

```sh
cd Assorted_Snippets
poetry run python python/parallel_programming/log_parsing.py
```

> PLANNED: try running against: "/private/var/log/system.log"

Links:

- async: https://realpython.com/async-io-python/#using-a-queue
- aiofiles: https://pypi.org/project/aiofiles
- async-files: https://pypi.org/project/async-files
- timeit: https://docs.python.org/3/library/timeit.html

"""

import string
import time
from pathlib import Path

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
] * 250

# # TODO: async function is shown as a SyntaxError in VSCode?
# ? import asyncio
# ? import aiofiles
# ? async def _read_lines(path_log: Path):  # noqa
# ?     async with aiofiles.open(path_log, mode='r') as _f:
# ?         async for line in _f:
# ?             logger.debug(line.strip())
# ? # > asyncio.run(_read_lines(path_log))


def _parse_line_bnf(line: str, write_log: bool = False):  # noqa: D103
    """Parse a single line in BNF format."""
    fields = LOG_LINE_BNF.parseString(line)
    if write_log:
        logger.debug('fields.dump(): {fields}\n', fields=fields.dump())
    # > logger.debug('repr(fields)', repr(fields))
    # > for key in fields.keys():
    # >     logger.debug(f'fields[{key}] = {fields[key]}')


def _gen_read_lines(path_log: Path) -> None:
    """Yield lines from the specified log file."""
    with open(path_log, mode='r') as _f:
        for line in _f.readlines():
            if line:
                yield line


def main_sync(path_log: Path) -> None:  # noqa: D103
    """Main function for synchronous parsing of the log file."""
    logger.debug(f'Parsing: {path_log}')
    try:
        for index, line in enumerate(_gen_read_lines(path_log)):
            _parse_line_bnf(line, index < 1)
    except ParseException:
        logger.exception(f'Failed to parse: {path_log}. Skipping')


def time_sync(path_log: Path) -> float:
    """Time the processing time for the synchronous approach."""
    start = time.perf_counter()
    main_sync(path_log)
    return time.perf_counter() - start


if __name__ == '__main__':
    """Run as a script file to test. See snippet at top."""
    dir_log = Path(__file__).resolve().parent / 'log'
    path_log_bnf = dir_log / 'bnf.log'
    path_log_bnf.write_text('\n'.join(BNF_TEST_DATA))

    sync_elapsed = time_sync(path_log_bnf)

    logger.info(f'time_snc: {sync_elapsed:0.2f}')  # ~0.76s
