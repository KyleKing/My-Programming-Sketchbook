# Based on: https://chase-seibert.github.io/blog/2014/03/21/python-multilevel-argparse.html
# Attempt at parsing the CLI commands, but became overly complex for a simple wrapper

import argparse
import inspect
import sys
from typing import Callable, List, Tuple


def get_members(cls, prefix: str = 'do_') -> List[Tuple[str, Callable]]:
    def member_filter(method):
        return (
            isinstance(method, Callable)
            and hasattr(method, '__name__')
            and method.__name__.startswith(prefix)
        )
    return inspect.getmembers(cls, predicate=member_filter)


class _CmdParser(object):

    _cmd_prefix = 'do_'

    def __init__(self):
        parser = argparse.ArgumentParser(description='Command Parser')
        parser.add_argument('command', help='Subcommand to run')
        # parse_args defaults to [1:] for args, but you need to
        # exclude the rest of the args too, or validation will fail
        print(sys.argv[1:])
        args = parser.parse_args(sys.argv[1:2])
        if not hasattr(self, args.command):
            print('Unrecognized command')
            parser.print_help()
            exit(1)
        # use dispatch pattern to invoke method with same name
        getattr(self, f'do_{args.command}')()

    def do_commit(self):
        parser = argparse.ArgumentParser(
            description='Record changes to the repository')
        # prefixing the argument with -- means it's optional
        parser.add_argument('--amend', action='store_true')
        # now that we're inside a subcommand, ignore the first
        # TWO argvs, ie the command (git) and the subcommand (commit)
        args = parser.parse_args(sys.argv[2:])
        print('Running git commit, amend=%s' % args.amend)

    def do_fetch(self):
        parser = argparse.ArgumentParser(
            description='Download objects and refs from another repository')
        # NOT prefixing the argument with -- means it's not optional
        parser.add_argument('repository')
        args = parser.parse_args(sys.argv[2:])
        print('Running git fetch, repository=%s' % args.repository)


if __name__ == '__main__':
    for member_name, call in get_members(_CmdParser):
        print(f'{member_name}: {call.__doc__} ({call!r})')

    _CmdParser()
    breakpoint()
