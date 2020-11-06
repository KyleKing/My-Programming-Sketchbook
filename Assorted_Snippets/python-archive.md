# Python Snippets (Archive)

Archived, but still useful Python snippets

- [Python Snippets (Archive)](#python-snippets-archive)
  - [logging (docs)](#logging-docs)
    - [logging.basicConfig (docs)](#loggingbasicconfig-docs)
    - [Rotating File Handler (Docs)](#rotating-file-handler-docs)
    - [Timed Rotating File Handler (Docs)](#timed-rotating-file-handler-docs)
  - [tkinter](#tkinter)

## logging ([docs](https://docs.python.org/3.8/library/logging.html))

Snippets demonstrating use of the Python logging module

### logging.basicConfig ([docs](https://docs.python.org/3.8/library/logging.html#logging.basicConfig))

```py
import logging
from pathlib import Path

LOGGER = logging.getLogger(__name__)
logging.basicConfig(
    format='%(asctime)s %(filename)s:%(lineno)d    %(message)s',
    level=logging.INFO, filename='demo_of_basicConfig.log', filemode='w',
)
LOGGER.debug('>Debug<')
LOGGER.info('>Info<')
LOGGER.warning('>Warning<')
```

### Rotating File Handler ([Docs](https://docs.python.org/3/library/logging.handlers.html#rotatingfilehandler))

```py
import logging
from logging import handlers
from pathlib import Path

LOGGER = logging.getLogger(__name__)
logging.basicConfig(format='%(message)s', level=logging.INFO


def add_file_handler(lgr, log_path, level=logging.DEBUG, fh_kwargs=None):
    """Create a file handler for logging output with generous formatting.

    Args:
        lgr: logger instance
        log_path: Path to the log file
        level: logging level, defaults to DEBUG
        fh_kwargs: optional dictionary with keyword arguments for `logging.handlers.RotatingFileHandler()`.
            If not specified, these keys/values wil be added: `(maxBytes=250000, backupCount=5)`

    """
    # Format the keyword arguments
    if fh_kwargs is None:
        fh_kwargs = {}
    for key, default in [('maxBytes', 250000), ('backupCount', 5)]:
        fh_kwargs[key] = fh_kwargs.get(key, 250000)
    # Create the filehandler
    fh = handlers.RotatingFileHandler(log_path, **fh_kwargs)
    fh.setLevel(level)
    fh.setFormatter(logging.Formatter('%(asctime)s %(filename)s:%(lineno)d\t%(message)s'))
    lgr.addHandler(fh)


if __name__ == '__main__':
    cur_file = Path(__file__).resolve()
    log_path = cur_file.parent / f'{cur_file.stem}.log'
    add_file_handler(LOGGER, log_path)
    LOGGER.debug('>>Debug<<')
    LOGGER.info('>>Info<<')
    LOGGER.warning('>>Warning<<')
    print(f'>> See verbose DEBUG logging in: "{log_path}"')  # noqa: T001
```

### Timed Rotating File Handler ([Docs](https://docs.python.org/3/library/logging.handlers.html#timedrotatingfilehandler))

Example once per minute: `handlers.TimedRotatingFileHandler(log_path, when='M', interval=1)`

## tkinter

```py
"""Tkinter login screen. Ported from GT Client."""

import tkinter as tk
from typing import Any, Optional


class LoginScreen:
    """Simple TKinter Login screen."""

    username: Optional[tk.StringVar] = None
    password: Optional[tk.StringVar] = None

    def __init__(self, title: str = 'Login Screen',  # noqa: S107
                 username: str = '', password: str = '') -> None:
        """Initialize the login screen.

        Args:
            title: screen title. Default is `'Login Screen'`
            username: username. Default is `''`
            password: password. Default is `''`

        """
        self.root = tk.Tk()
        self.root.title(title)
        self.root.geometry('300x100')

        self.username = tk.StringVar()
        self.username.set(username)
        self.password = tk.StringVar()
        self.password.set(password)

        self.layout()
        self.root.mainloop()

    def layout(self) -> None:
        """Layout the login screen."""
        width_label = 10
        width_entry = 20
        pack_label = {'side': tk.LEFT, 'padx': 5, 'pady': 5}
        pack_entry = {'fill': tk.X, 'padx': 5, 'expand': True}

        frame_user = tk.Frame(self.root)
        frame_user.pack(fill=tk.X)
        tk.Label(frame_user, text='Username: ', width=width_label).pack(**pack_label)
        entry_user = tk.Entry(frame_user, textvariable=self.username, width=width_entry)
        entry_user.pack(**pack_entry)
        entry_user.focus()

        frame_pass = tk.Frame(self.root)
        frame_pass.pack(fill=tk.X)
        tk.Label(frame_pass, text='Password: ', width=width_label).pack(**pack_label)
        entry_pass = tk.Entry(frame_pass, textvariable=self.password, show='*', width=width_entry)
        entry_pass.pack(**pack_entry)

        frame_submit = tk.Frame(self.root)
        frame_submit.pack(fill=tk.X)
        tk.Button(frame_submit, text='Submit (or hit Enter)', command=self.on_submit).pack(side=tk.BOTTOM, pady=5)
        self.root.bind('<Return>', self.on_submit)  # Also use the return/enter key to submit

    def on_submit(self, *args: tk.Event) -> None:
        """Submit and destroy the login screen.

        Args:
            *args: optional tkinter event that is passed by bind, but not button commands

        """
        self.root.destroy()


def prompt_user_pass(**kwargs: Any) -> tuple:
    """Prompt for username/password.

    Args:
        kwargs: additional keyword arguments for LoginScreen like `username` or `password`

    Returns:
        tuple: tuple with username and password

    Raises:
        RuntimeError: if the user doesn't enter their username and/or password

    """
    app = LoginScreen(**kwargs)
    username = app.username.get()
    password = app.password.get()
    if not all([username, password]):
        raise RuntimeError('User did not properly input a username and password. Re-launch the applet')
    return (username, password)


if __name__ == '__main__':
    def test_prompt_user_pass() -> None:
        credentials = ('USER', 'PASS')
        assert prompt_user_pass(username='USER', password='PASS') == credentials  # noqa: S101,S106
```
