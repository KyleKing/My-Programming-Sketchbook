# NEW (WIP)

## Dotted Dict

FIXME: Use dotted dict instead of enum for mapping global keys?

1. [cdgriffith/Box](https://github.com/cdgriffith/Box)
1. [attrdict/](https://pypi.org/project/attrdict/)
1. [dotted-dict](https://pypi.org/project/dotted-dict/)

## Portables

TODO: Make [smaller pyinstaller without mkl](https://docs.anaconda.com/mkl-optimizations/)?

TODO: improve pyinstaller notes:

```sh
poetry run pyinstaller script.py                        # Compiles into './dist/script' directory.
poetry run pyinstaller script.py --onefile              # Compiles into './dist/script' console app.
poetry run pyinstaller script.py --windowed             # Compiles into './dist/script' windowed app.
poetry run pyinstaller script.py --add-data '<path>:.'  # Adds file to the root of the executable.
# File paths need to be updated to 'os.path.join(sys._MEIPASS, <path>)'.
```

TODO: Check out nutika: [Overview](https://packaging.python.org/overview/) and [Docs](https://nuitka.net/doc/user-manual.html)

- Nuitka * Converts your Python to C and compiles it to a native binary file * This can be particularly convenient if you wish to obfuscate the Python source code behind your application * Recommend invoking with --follow-imports flag like: python3 -m nuitka --follow-imports your_app.python3

## Plain Python

PLANNED: [Check out coroutines](https://github.com/gto76/python-cheatsheet#coroutines)

PLANNED: [Also see threading](https://github.com/gto76/python-cheatsheet#threading)

## Profiling

PLANNED: [gto76/python-cheatsheet#profiling](https://github.com/gto76/python-cheatsheet#profiling)

## Sockets

[Magic Number is bufsize](https://docs.python.org/3/library/socket.html#socket.socket.recv)

```py
socket.recv(bufsize=4096)
```

PLANNED: Add notes from python-mocket examples
