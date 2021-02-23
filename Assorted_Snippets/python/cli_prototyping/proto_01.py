"""External Tools and Design Pattern Prototype 01.

- prompt-toolkit: https://github.com/prompt-toolkit/python-prompt-toolkit

"""

from collections import OrderedDict
from enum import Enum

import attr
from implements import Interface, implements
from prompt_toolkit import prompt
from prompt_toolkit.shortcuts import input_dialog, set_title

# For prompt_toolkit, also see:
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/dialogs/progress_dialog.py
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/dialogs/radio_dialog.py
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/dialogs/yes_no_dialog.py
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/prompts/confirmation-prompt.py

# See auto-suggestion/history
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/prompts/up-arrow-partial-string-matching.py
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/prompts/auto-suggestion.py
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/prompts/autocorrection.py

# A lexer might be a cool addition
# https://github.com/prompt-toolkit/python-prompt-toolkit/blob/master/examples/tutorial/sqlite-cli.py

# ==============================================================================
# > client.py: REST interface

# Consider the `command` pattern for REST requests where
# - the actions are Receivers
# - the command is MakeRESTRequest
# - and invoker is the CLI/prompt
# Link: https://github.com/tylerlaberge/PyPattyrn#command-pattern


class Borg:
    """Borg non-pattern for multiple instance with the same shared state.

    Based on: https://github.com/faif/python-patterns/blob/master/patterns/creational/borg.py

    """

    _shared_state = {}

    def __init__(self):
        self.__dict__ = self._shared_state


@attr.s
class UserCredentials:

    username = attr.ib(default=None)
    password = attr.ib(default=None)
    username_prev = attr.ib(default=None, kw_only=True)


class APIClient(Borg):

    def __init__(self):
        super().__init__()
        if getattr(self, 'credentials', None) is None:
            self.credentials = UserCredentials()

    def login(self, username, password):
        self.credentials = UserCredentials(username, password, )

    def logout(self):
        self.credentials = UserCredentials(None, None, username_prev=self.credentials.username)

    def request(self, endpoint, **kwargs):
        raise NotImplementedError('Planned functionality')


# ==============================================================================
# > actions.py: CLI keyword actions


class ActionInterface(Interface):

    keyword = ''
    help_text = ''
    endpoint = ''

    def call(self, *args):
        pass


@implements(ActionInterface)
class _Movie:

    keyword = 'new_movie'
    help_text = 'new_movie,<title>,<year>,etc.'

    endpoint = '/movie/submit'

    def call(self, *args):
        if len(args) != 2:
            raise RuntimeError(f'Expected 2 arguments. Received: {args}')


@implements(ActionInterface)
class _DemoGroup:

    keyword = 'new_group'
    help_text = 'new_group,<long_name>,<shot_name>,etc.'

    endpoint = '/demo_group/new'

    def call(self, *args):
        if len(args) != 33:
            raise RuntimeError(f'Expected 33 arguments. Received: {args}')


class Actions(Enum):

    MOVIE = _Movie()
    DEMO_GROUP = _DemoGroup()


# ==============================================================================
# > controller.py: Interactive CLI


class Controller:

    app_name = 'Streaming Wars'

    delimiter = ','
    keywords_help = ['help', 'h', '--help']
    keywords_quit = ['quit', 'exit', 'let_me_out!']
    keywords_login = ['login']
    keywords_logout = ['logout']

    cmd_lookup = None
    help_text = None

    def __init__(self, actions=Actions):
        self.cmd_lookup = OrderedDict([(cmd.value.keyword, cmd.value) for cmd in actions])
        self.help_text = (f'{self.app_name} Help Information:'
                          f'\n  {self.keywords_help[0]}: display help information'
                          f'\n  {self.keywords_quit[0]}: close the application')
        for keyword, cmd in self.cmd_lookup.items():
            self.help_text += f'\n  {keyword}: {cmd.help_text}'

        self.aliases.update({'exit': 'quit', 'help': 'help -v'})  # Convenient!

    def configure_prompt(self):
        set_title('Streaming Wars Application')

    def prompt_user_pass(self):
        username = 'Placeholder'  # Can there be an input dialog with two inputs?
        title = f'{self.app_name} Password input'
        password = input_dialog(title=title, text='Password:', password=True).run()
        return (username, password)

    def login(self, username, password):
        APIClient().login(username, password)
        print(f'API Client has been initialized with: {APIClient().credentials}')

    def logout(self):
        APIClient().logout()
        print(f'API Client has been logged out: {APIClient().credentials}')

    def read_prompt(self):
        return [arg.strip() for arg in prompt('\n> ').split(self.delimiter)]

    def listen(self):
        print('\nWelcome to Streaming Wars, the Sequel!\n\n'
              f'Enter information in the below prompts to interact or type `{self.keywords_help[0]}` for help',
              '\nThe first thing you will need to do is login. Type "login" and complete the prompts')

        # Accept STDIN, use lookup
        self.configure_prompt()
        keyword = None
        while keyword not in self.keywords_quit:
            try:
                keyword = self.single_command()
            except Exception as err:
                print(f'Error: Hit a snag ({err}). Try again or type "{self.keywords_quit[0]}" to quit')

    def single_command(self):
        args = self.read_prompt()
        keyword = args[0]
        if keyword in self.keywords_quit:
            pass
        elif keyword in self.keywords_login:
            self.login(*self.prompt_user_pass())
        elif keyword in self.keywords_logout:
            self.logout()
            raise
        elif keyword in self.keywords_help:
            print(self.help_text)
        elif keyword in self.cmd_lookup:
            instance = self.cmd_lookup[keyword]
            try:
                instance.call(*args[1:])
            except Exception as err:
                print(f'Error when calling action for "{keyword}": {err}')
        else:
            print(f'Error: unknown keyword: {keyword}\nType "{self.keywords_help[0]}" for help')

        return keyword

        # PLANNED: add support for a `source` keyword with an optional file path (or will show UI picker)
        # May have a fork for parsing an individual line vs. parsing a source file because the latter will need
        #   to stop if an error is caught
        #
        # if keyword == self.keyword_source:
        #     # Add feature to show tkinter file select if the path isn't specified
        #     for line in Path(args[1]).read_text().split('\n'):
        #         ...()


if __name__ == '__main__':
    # Test that the borg pattern works as expected
    api_client = APIClient()
    api_client.login('user1', 'pass')
    assert api_client.credentials.password == 'pass'

    api_client_new = APIClient()
    assert api_client_new.credentials.username == 'user1'
    assert api_client_new.credentials.password == 'pass'
    assert api_client_new.credentials.username_prev is None
    api_client_new.login('user_new', 'pass_new')
    api_client_new.logout()

    api_client_newest = APIClient()
    assert api_client_newest.credentials.username is None
    assert api_client_newest.credentials.password is None
    assert api_client_newest.credentials.username_prev == 'user_new'
