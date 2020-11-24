"""External Tools and Design Pattern Prototype 02.

- cliff: https://docs.openstack.org/cliff/latest/user/introduction.html
- demo app: https://opendev.org/openstack/cliff/src/branch/master/demoapp

Issues:

- The help text is confusing when it says `help -v` but the -v from the initial sys arguments and not
    in the interactive app. Running `help -v` causes the app to crash
    (`Documented commands (use 'help -v' for verbose/'help <topic>' for details):`)
- Crashes bring down the whole interactive app, which is not desireable
- Ctrl C doesn't exit (actually Ctrl-D should work)

"""

import logging
import os
import sys
from pathlib import Path

import attr
from cliff.app import App
from cliff.command import Command
from cliff.commandmanager import CommandManager
from cliff.lister import Lister
from cliff.show import ShowOne

from . import __pkg_name__, __version__

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# ==============================================================================
# > commands.py


class _Movie(Command):

    _keyword = 'new_movie'

    log = logging.getLogger(__name__)

    def take_action(self, parsed_args):
        self.app.stdout.write(f'{parsed_args}\n')


class _DemoGroup(Command):

    _keyword = 'new_group'

    log = logging.getLogger(__name__)

    def take_action(self, parsed_args):
        self.app.stdout.write(f'{parsed_args}\n')

    def get_parser(self, prog_name):
        parser = super().get_parser(prog_name)
        # See argparse docs: https://docs.python.org/3/library/argparse.html
        # and cmd2 docs: https://cmd2.readthedocs.io/en/latest/api/argparse_custom.html
        # Doesn't have error handling if year can't be converted to int
        # Returns a list of one argument, which need to be unwrapped
        parser.add_argument('long_name', nargs=1, help='full movie name')
        parser.add_argument('short_name', nargs=1, help='short movie name')
        parser.add_argument('year', nargs=1, type=int, help='movie year')
        add_group = parser.add_argument_group(
            title='Additional kwargs',
            description='Additional keyword arguments',
        )
        choices = ['choice1', 'choice2']
        choice_default = choices[0]
        add_group.add_argument(
            '-c', '--choice',
            action='store',
            dest='choices',
            metavar='choice',
            choices=choices,
            default=choice_default,
            help=f'the output format, defaults to {choice_default}',
        )
        return parser


# ==============================================================================
# Other example with cliff functionality


class File(ShowOne):  # How is this different than Lister?
    "Show details about a file"

    log = logging.getLogger(__name__)

    def get_parser(self, prog_name):
        parser = super().get_parser(prog_name)
        parser.add_argument('filename', nargs='?', default='.')
        return parser

    def take_action(self, parsed_args):
        stat_data = os.stat(parsed_args.filename)
        columns = ('Name',
                   'Size',
                   'UID',
                   'GID',
                   'Modified Time',
                   )
        data = (parsed_args.filename,
                stat_data.st_size,
                stat_data.st_uid,
                stat_data.st_gid,
                stat_data.st_mtime,
                )
        return (columns, data)


class Files(Lister):
    """Show a list of files in the current directory.

    The file name and size are printed by default.
    """

    log = logging.getLogger(__name__)

    def take_action(self, parsed_args):
        columns = ('Name', 'Size', 'Modified Time')

        def format_data(pth):
            stat_data = pth.stat()
            return (pth.name, stat_data.st_size, int(stat_data.st_mtime))

        return (columns, [format_data(n) for n in Path('.').glob('*.*')])


# ==============================================================================
# > cli_app.py


class CLIApp(App):

    LOG = logging.getLogger(__name__)

    cmd_data = attr.make_class('cmd_data', ['name', 'command_class'])

    cmd_data_list = [
        cmd_data(_Movie._keyword, _Movie),
        cmd_data(_DemoGroup._keyword, _DemoGroup),
        cmd_data('show file', File),
        cmd_data('files', Files),
        cmd_data('list files', Files),  # Can assign multiple command string
    ]

    def __init__(self):
        mgr = CommandManager('')
        for data in self.cmd_data_list:
            mgr.add_command(data.name, data.command_class)

        super().__init__(
            description=__pkg_name__,
            version=__version__,
            command_manager=mgr,
            deferred_help=True,
        )

    def initialize_app(self, argv):
        self.LOG.debug('initialize_app')

    def prepare_to_run_command(self, cmd):
        self.LOG.debug('prepare_to_run_command %s', cmd.__class__.__name__)

    def clean_up(self, cmd, result, err):
        self.LOG.debug('clean_up %s', cmd.__class__.__name__)
        if err:
            self.LOG.debug('got an error: %s', err)


def main(argv=sys.argv[1:]):
    """Run the CLIApp."""
    my_app = CLIApp()
    return my_app.run(argv)


if __name__ == '__main__':
    sys.exit(main())
