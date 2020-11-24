"""Experimenting with cmd2.

Useful snippets

```
set echo true
set timing true
set quiet false
set editor 'nano'

!ls -a
history -s > history.txt
# Or append
history -s >> history.txt
run_script history.txt
@history.txt

# To Clipboard (`cmd >`)
!echo this will be pasteable! >
```

Working with STDIN:

```
echo "speak -p some words" | python examples/example.py
type somecmds.txt | python.exe examples/example.py

# Or run commands immediately on launch
python examples/example.py help
```

If needed, startup scripts can be passed to `super().__init__(startup_script='.cmd2rc')` example:
https://github.com/python-cmd2/cmd2/blob/master/examples/alias_startup.py


More examples

- Full example with [super().__init__()](https://cmd2.readthedocs.io/en/latest/features/initialization.html)
    - Colorizing/stylizing output
    - Using multiline commands
    - Persistent history
    - How to run an initialization script at startup
    - How to group and categorize commands when displaying them in help
    - Opting-in to using the ipy command to run an IPython shell
    - Allowing access to your application in py and ipy
    - Displaying an intro banner upon starting your application
    - Using a custom prompt
    - How to make custom attributes settable at runtime

- Example with async: https://github.com/python-cmd2/talks/blob/master/PyOhio_2019/examples/async_printing.py

"""

import argparse
import getpass
import warnings
from pathlib import Path

from cmd2 import Cmd, Cmd2ArgumentParser, CommandResult, Settable, with_argparser, with_argument_list, with_category


class SettablesExampleApp(Cmd):
    """A simple cmd2 application with settables.

    Note that there are several builtin settables. A few of interest are below:

    - debug: False              # Show full traceback on exception
    - echo: False               # Echo command issued into output (useful for running scripts)
    - editor: 'vim'             # Program used by 'edit'
    - quiet: False              # Don't print nonessential feedback
    - timing: False             # Report execution times

    See documentation: https://cmd2.readthedocs.io/en/latest/features/settings.html#settings

    """

    def __init__(self):
        """Example with settable values (`use `set param value` or `set -v`)."""
        super().__init__()
        settables = [
            (22, Settable('degrees_c', int, 'Temperature in Celsius',
                          onchange_cb=self._onchange_degrees_c)),
            (False, Settable('sunny', bool, 'Is it sunny outside?')),
        ]
        for default, settable in settables:
            setattr(self, settable.name, default)
            self.add_settable(settable)

        # Overriding the builtins must happen after the super().__init__()
        self.debug = True
        self.timing = True

        # Quit on Ctrl-C: https://cmd2.readthedocs.io/en/latest/features/misc.html#quit-on-sigint
        self.quit_on_sigint = True

    def _onchange_degrees_c(self, param_name, old, new):
        """If it's over 40C, it's gotta be sunny, right?"""
        self.sunny = new > 40
        self.poutput(f'_onchange.degrees_c, self.sunny={self.sunny}')


class BuiltinsExampleApp(Cmd):
    """A simple cmd2 application with toggled builtins.

    See: https://cmd2.readthedocs.io/en/latest/features/builtin_commands.html#builtin-commands

    """

    def __init__(self):
        super().__init__()
        # removed_builtins = ['alias', 'help', 'macro', 'run_script', 'shell', 'edit', 'history', 'py',
        #                     'run_pyscript', 'set', 'shortcuts']  # Don't remove quit!
        # for removed_builtin in removed_builtins:  # noqa: E800
        #     delattr(Cmd, f'do_{removed_builtin}')  # noqa: E800
        # self.poutput(f'Check `help -v`. Removed: {removed_builtins}')  # noqa: E800

        # What I really want is to limit the help documentation to end users of sw_cli who won't be using cmd2
        self.hidden_commands.extend(['alias', 'help', 'macro', 'run_script', 'shell', 'edit', 'history', 'py',
                                     'run_pyscript', 'set', 'shortcuts', 'quit'])


class DisabledCommands(Cmd):
    """An application which disables and enables commands"""

    def do_lock(self, line):
        self.disable_command('open', "you can't open the door because it is locked")
        self.poutput('the door is locked')

    def do_unlock(self, line):
        self.enable_command('open')
        self.poutput('the door is unlocked')

    def do_open(self, line):
        """open the door"""
        self.poutput('opening the door')


class PyApp(Cmd):
    """A simple cmd2 application with ipy.

    - Access your application instance via self (and any changes to your application made via self will persist)
        - Need to set `self.self_in_py = True` to access `self`
        - Call commands with `app('say --piglatin Blah')` or `self.onecmd_plus_hooks('help')`
    - Get help on objects with ?
    - etc.

    See: https://cmd2.readthedocs.io/en/latest/features/embedded_python_shells.html
    and: https://github.com/python-cmd2/cmd2/issues/979

    """

    def __init__(self):
        super().__init__(use_ipython=True)  # WE NOW HAVE ipy!
        self.self_in_py = True


# =====================================

speak_parser = argparse.ArgumentParser()
speak_parser.add_argument('-p', '--piglatin', action='store_true', help='atinLay')
speak_parser.add_argument('-s', '--shout', action='store_true', help='N00B EMULATION MODE')
speak_parser.add_argument('-r', '--repeat', type=int, help='output [n] times')
speak_parser.add_argument('words', nargs='+', help='words to say')


class SpeakApp(Cmd):
    """A simple cmd2 application with commands."""

    maxrepeats = 10

    @with_argparser(speak_parser)
    def do_speak(self, args):
        """Repeats what you tell me to."""
        words = []
        for word in args.words:
            if args.piglatin:
                word = word[1:] + f'{word[0]}ay'
            if args.shout:
                word = word.upper()
            words.append(word)
        repetitions = args.repeat or 1
        for _ in range(min(repetitions, self.maxrepeats)):
            # .poutput handles newlines and accommodates output redirection too
            self.poutput(' '.join(words))


# =====================================


class SingleArgAction(argparse.Action):
    """Argparse action to return only the first argument."""

    def __call__(self, parser, args, values, *_args, **kwargs):
        """If no value is given on the command line, prompt user for secure entry of a password."""  # noqa: DAR101
        setattr(args, self.dest, values[0])


class UsernamePromptAction(argparse.Action):
    """Argparse username prompt."""

    def __call__(self, parser, args, values, option_string=None):
        """If no value is given on the command line, prompt user for secure entry of a password."""  # noqa: DAR101
        setattr(args, self.dest, ' '.join(values) if values else input('Username: '))


class PasswordPromptAction(argparse.Action):
    """Argparse secure password prompt."""

    def __call__(self, parser, args, values, option_string=None):
        """If no value is given on the command line, prompt user for secure entry of a password."""  # noqa: DAR101
        setattr(args, self.dest, ' '.join(values) if values else getpass.getpass())
        if values:
            security_warning = ('The `-p` option is only for development and should be excluded so that the password'
                                ' can be entered securely, rather than shown in plain text on the prompt')
            warnings.warn(security_warning, getpass.GetPassWarning)


LOGIN_PARSER = Cmd2ArgumentParser(description='Prompt for Username and Password')
LOGIN_PARSER.add_argument('username', type=str, action=UsernamePromptAction, nargs='?', help='username')
LOGIN_PARSER.add_argument('-p', '--password', type=str, action=PasswordPromptAction, nargs='*', help=argparse.SUPPRESS)


class OverrideCLIArgsApp(Cmd):  # noqa: H601
    """Example overriding the CLI args.

    See: https://cmd2.readthedocs.io/en/latest/features/startup_commands.html#commands-at-invocation

    Related is the transcript, which can be run with `allow_cli_args=False` as well:
    https://cmd2.readthedocs.io/en/latest/features/transcripts.html?highlight=allow_cli_args#running-a-transcript

    """

    def __init__(self):
        """Initialize Command Line App."""
        super().__init__(allow_cli_args=False)
        self.store_login_args(LOGIN_PARSER.parse_args())

    def store_login_args(self, login_args):
        """Manual login (or re-login)."""
        if not login_args.username:
            login_args.username = getpass.getuser()
            assert login_args.username
        if not login_args.password:
            login_args.password = getpass.getpass()
            assert login_args.password
        self.poutput(f'{login_args.username}:{login_args.password}')

    @with_argparser(LOGIN_PARSER)
    def do_login(self, line):
        """Manual login (or re-login)."""
        self.store_login_args(line)


# =====================================


dir_parser = argparse.ArgumentParser()
dir_parser.add_argument('-l', '--long', action='store_true', help='display in long format with one item per line')

CMD_CAT_CONNECTING = 'Example Custom Command Category'


class CmdLineApp(Cmd):
    """Example cmd2 application."""

    cwd = Path('.')

    def do_say(self, statement):
        # statement contains a string
        self.poutput(statement.arg_list)
        self.poutput(statement.title())

    def do_speak(self, statement):
        # statement also has a list of arguments
        # quoted arguments remain quoted
        for arg in statement.arg_list:
            self.poutput(arg)

    @with_argument_list
    def do_speak_list(self, arg_list):
        # arglist contains a list of arguments (same as statement.arg_list w/o decorator)
        for arg in arg_list:
            self.poutput(arg)

    def do_articulate(self, statement):
        # statement.argv contains the command
        # and the arguments, which have had quotes
        # stripped
        for arg in statement.argv:
            self.poutput(arg)

    @with_argparser(dir_parser, with_unknown_args=True)
    def do_dir(self, args, unknown):
        """List contents of current directory."""
        # This command doesn't accept arguments
        if unknown:
            self.perror('dir does not take any positional arguments:')
            self.do_help('dir')
            self.last_result = CommandResult('', 'Bad arguments')
            return

        # Get the contents as a list
        paths = [*self.cwd.glob('*')]
        if args.long:
            for pth in paths:
                self.poutput(pth.resolve())
        else:
            self.poutput(paths)

    # Example with categorization - note: argparse decorator order is important
    # https://cmd2.readthedocs.io/en/latest/features/argument_processing.html?highlight=args#decorator-order
    # with_category documentation; https://cmd2.readthedocs.io/en/latest/features/help.html
    @with_category(CMD_CAT_CONNECTING)
    def do_which(self, _):
        """Which command"""
        self.poutput('sandwhich')

    # Selection menu: https://cmd2.readthedocs.io/en/latest/features/misc.html#select
    def do_eat(self, arg):
        sauce = self.select('sweet salty', 'Sauce? ')
        result = '{food} with {sauce} sauce, yum!'
        result = result.format(food=arg, sauce=sauce)
        self.stdout.write(result + '\n')

    # Using exit codes: https://cmd2.readthedocs.io/en/latest/features/commands.html#exit-codes
    def do_bail(self, line):
        """Exit the application"""
        self.perror('fatal error, exiting')
        self.exit_code = 2
        return True

    def do_exit(self, line):
        """Exit the application"""
        return True  # Return True indicates that prompting should stop


INSTANCE = CmdLineApp
"""Pointer to be invoked from main.py."""


if __name__ == '__main__':
    import sys
    sys.exit(INSTANCE().cmdloop())
