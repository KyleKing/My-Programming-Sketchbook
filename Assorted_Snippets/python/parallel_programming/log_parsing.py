"""Example working with PyParsing and async.

FIXME: Create more log data and test if async can be faster. Show different log file formats

Links

- pyparsing: https://github.com/pyparsing/pyparsing/blob/master/examples/httpServerLogParser.py
- async: https://realpython.com/async-io-python/#using-a-queue
- aiofiles: https://pypi.org/project/aiofiles/
- timeit: https://docs.python.org/3/library/timeit.html

"""

import string
from pathlib import Path
from typing import Any, List

from loguru import logger
from pyparsing import Combine, Group, Suppress, Word, alphas, dblQuotedString, delimitedList, nums, removeQuotes


def get_cmd_fields(_s, _loc, tokens) -> None:  # noqa
    tokens['method'], tokens['request_uri'], tokens['protocol_version'] = tokens[0].strip('"').split()


def _create_log_line_bnf() -> None:  # noqa: D103
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
        + dblQuotedString.setResultsName('cmd').setParseAction(get_cmd_fields)
        + (integer | '-').setResultsName('status_code')
        + (integer | '-').setResultsName('num_bytes_sent')
        + dblQuotedString.setResultsName('referrer').setParseAction(removeQuotes)
        + dblQuotedString.setResultsName('client_sfw').setParseAction(removeQuotes)
    )


LOG_LINE_BNF = _create_log_line_bnf()


# # TODO: async function is shown as a SyntaxError in VSCode?
# ? import asyncio
# ? import aiofiles
# ? async def read_lines(path_log: Path) -> List[Any]:  # noqa
# ?     async with aiofiles.open(path_log, mode='r') as _f:
# ?         async for line in _f:
# ?             print(line.strip())
# ? # > asyncio.run(read_lines(path_log))


def parse_line(line: str) -> Any:  # noqa: D103
    fields = LOG_LINE_BNF.parseString(line)
    print('fields.dump()', fields.dump())
    # > print('repr(fields)', repr(fields))
    # > for key in fields.keys():
    # >     print(f'fields[{key}] = {fields[key]}')
    print('')


def read_lines(path_log: Path) -> List[Any]:  # noqa: D103
    with open(path_log, mode='r') as _f:
        for line in _f.readlines():
            if line:
                parse_line(line)
            else:
                logger.info('no line...')


def main(dir_log: Path) -> None:  # noqa: D103
    log_files = [*dir_log.rglob('*.log')][:1]
    for path_log in log_files:
        print(path_log)
        read_lines(path_log)


if __name__ == '__main__':
    import time
    start = time.perf_counter()
    dir_log = Path(__file__).resolve().parent / 'log'
    main(dir_log)
    elapsed = time.perf_counter() - start
    print(f'{Path(__file__).name} executed in {elapsed:0.2f} seconds.')
