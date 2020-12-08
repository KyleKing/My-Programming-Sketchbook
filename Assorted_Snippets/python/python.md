# Python Snippets

Useful Python snippets

- [Python Snippets](#python-snippets)
  - [Cheat Sheets](#cheat-sheets)
  - [Plain Python](#plain-python)
    - [Warnings](#warnings)
    - [Python Getter/Setter](#python-gettersetter)
    - [Pathlib (docs)](#pathlib-docs)
    - [tempfile TemporaryDirectory (docs)](#tempfile-temporarydirectory-docs)
    - [Merging Dictionaries](#merging-dictionaries)
    - [f-strings](#f-strings)
    - [Regex](#regex)
    - [Sockets (Docs)](#sockets-docs)
  - [Run Python Script with auto-PDB Shell on Exception](#run-python-script-with-auto-pdb-shell-on-exception)
  - [Dataset](#dataset)
  - [funcy](#funcy)
  - [Pandas](#pandas)
    - [Modify print format (docs)](#modify-print-format-docs)
    - [pd DataFrame.from_records (docs)](#pd-dataframefrom_records-docs)
    - [itertuples (docs)](#itertuples-docs)
  - [Filter](#filter)
  - [Plotly](#plotly)
    - [px](#px)
    - [line charts (docs)](#line-charts-docs)
  - [PyTest](#pytest)
    - [commands (assumes using poetry) (docs)](#commands-assumes-using-poetry-docs)
    - [markers (docs)](#markers-docs)
    - [parametrize (docs)](#parametrize-docs)
  - [Data Version Control (DVC) (Docs)](#data-version-control-dvc-docs)
  - [Pandera: Pandas Schemas (WIP)](#pandera-pandas-schemas-wip)
  - [isort](#isort)
  - [Conda](#conda)
  - [Logging with Loguru (docs)](#logging-with-loguru-docs)
    - [For Packages](#for-packages)
    - [General Logging Notes](#general-logging-notes)
    - [Loguru: Custom Sinks](#loguru-custom-sinks)
    - [Loguru: Async](#loguru-async)
    - [Encrypted Logs?](#encrypted-logs)

## Cheat Sheets

- [gto76/python-cheatsheet](https://github.com/gto76/python-cheatsheet)
- [crazyguitar/pysheeet](https://github.com/crazyguitar/pysheeet)

## Plain Python

[Main Documentation](https://docs.python.org/3.9/)

### Warnings

```py
import warnings

warnings.warn('This decorator will be deprecated. Use `with_argparser(parser, with_unknown_args=True)`.',
                PendingDeprecationWarning, stacklevel=2)
```

### Python Getter/Setter

```py
class MyClass:
    _a = None

    @property
    def a(self):
        return self._a

    @a.setter
    def a(self, value):
        self._a = value
```

More complex example from dash_dev

```py
class Chart:
    """Example class with setter method."""

    _axis_range: dict = {}

    # Full property (getter) definition
    # @property
    # def axis_range(self): dict:
    #     """Specify x/y axis range or leave as empty dictionary for auto-range.
    #
    #     Returns:
    #         dict: dictionary potentially with keys `(x, y)`
    #
    #     """
    #     return self._axis_range

    # Short hand property assignment
    axis_range: dict = property(lambda self: self._axis_range)
    """Specify x/y axis range or leave as empty dictionary for auto-range. Dictionary with keys `(x, y)`."""

    @axis_range.setter
    def axis_range(self, axis_range: dict) -> None:
        """Assign new axis_range."""
        self._axis_range = axis_range
```

### Pathlib ([docs](https://docs.python.org/3/library/pathlib.html))

For directory or file names, `.name`, `.stem`,  and `.suffix`

```py
<Path> = Path()                     # Returns relative cwd. Also Path('.').
<Path> = Path.cwd()                 # Returns absolute cwd. Also Path().resolve().
<Path> = Path.home()                # Returns user's home directory.
<Path> = Path(__file__).resolve()   # Returns script's path if cwd wasn't changed.
```

See notes like above and more from [gto76/python-cheatsheet#path-object](https://github.com/gto76/python-cheatsheet#path-object)

### tempfile TemporaryDirectory ([docs](https://docs.python.org/3.8/library/tempfile.html#tempfile.TemporaryDirectory))

```py
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as td:
    tmp_dir = Path(td)
```

### Merging Dictionaries

```py
dict1 = {'a': 1, 'c': None}
default = {'b': 2, 'c': 3}

# In 3.9, you can use a pipe
dict3 = dict1 | default

# But for now, this works
dict3 = {**default, **dict1}
# > {'b': 2, 'c': None, 'a': 1}
```

### f-strings

Based on "[73 might be excessive](https://miguendes.me/73-examples-to-help-you-master-pythons-f-strings)"

Format options (`!s` < default `str()`, `!r` using `__repr__`, and `!a` to escape non-ASCII)

```py
f"{c}"  # >> 'A RGB color'
# When `obj!r` is used, the __repr__ output is printed
f"{c!r}"  # >> 'Color(r=123, g=32, b=255)'
utf_str = "Áeiöu"  # >> f"{utf_str!a}"  # >> "'\\xc1ei\\xf6u'"
```

Number Formatting

```py
f"num rounded to 2 decimal places = {num:.2f}"  # >> 'num rounded to 2 decimal places = 4.12'
f"Percentage of true positive: {perc:%}"  # >> 'Percentage of true positive: 39.080460%'
f"Percentage of true positive: {perc:.2%}"  # >> 'Percentage of true positive: 39.08%'
f"{1234567890.123456:,.3f}"  # >> '1,234,567,890.123'
f"{num:e}"  # >> '2.343553e+06'
f"{num:.2e}"  # >> '2.34e+06'

num = 42
f"{num:05}"  # >> '00042'
f'{num:+010}'  # >> '+000000042'

num = -42
f'{num:010}'  # >> '-000000042'
f'{num:+010}'  # >> '-000000042'
f'{num:-010}'  # >> '-000000042'
```

Padding

```py
greetings = "hello"
f"She says {greetings:>10}"  # >> 'She says      hello'
# Pad 10 char to the right
f"{greetings:>10}"  # >> '     hello'
f"{greetings:<10}"  # >> 'hello     '
# Or omit the < for left padding
f"{greetings:10}"  # >> 'hello     '

hello = "world"
f"{hello:^11}"  # >> '   world   '
f"{hello:*^11}"  # >> '***world***'
# Extra padding is added to the right
f"{hello:*^10}"  # >> '**world***'
# N shorter than len(hello)
f"{hello:^2}"  # >> 'world'
```

Escaping

```py
f"{{hello}} = {hello}"  # >> '{hello} = world'
```

Datetime

```py
import datetime
now = datetime.datetime.now()
ten_days_ago = now - datetime.timedelta(days=10)
f'{ten_days_ago:%Y-%m-%d %H:%M:%S}'  # >> '2020-10-13 20:24:17'
f'{now:%Y-%m-%d %H:%M:%S}'  # >> '2020-10-23 20:24:17'
```

### Regex

See [gto76/python-cheatsheet#regex](https://github.com/gto76/python-cheatsheet#regex) and [crazyguitar/pysheeet](https://github.com/crazyguitar/pysheeet/blob/master/docs/notes/python-rexp.rst) for more

```py
import re

re_var_comment = re.compile(r'<!-- (?P<key>[^=]+)=(?P<value>[^;]+);')

section = '<!-- rating=1; -->'
re_var_comment.match(section.strip()).groupdict()  # {'rating': '1'}
```

### Sockets ([Docs](https://docs.python.org/3.8/howto/sockets.html))

A whole long list of socket examples on [crazyguitar/pysheeet](https://github.com/crazyguitar/pysheeet/blob/master/docs/notes/python-socket.rst)

The [Magic 4096 Number is bufsize](https://docs.python.org/3/library/socket.html#socket.socket.recv) `socket.recv(bufsize=4096)`

See prototpe cmd2/file socket: [./_cli_prototyping/proto_file_socket.py](./_cli_prototyping/proto_file_socket.py)

## Run Python Script with auto-PDB Shell on Exception

[Based on an SO answer (link)](https://stackoverflow.com/a/2438834/3219667)

`python -m pdb -c continue myscript.py`

## Dataset

[Main Documentation](https://dataset.readthedocs.io/en/latest/)

```py
import dataset
import pandas as pd

db = dataset.connect('sqlite:///:memory:')
table_name = 'new_table'

# Create the table with an example primary_id and type for indexing
table = db.create_table(table_name, primary_id='prim_id', primary_type=db.types.integer)
# Demonstrate CRUD functionality
table.insert(dict(prim_id=1, name='John Doe', age=37))
table.insert(dict(prim_id=2, name='Jane Doe', age=34, gender='female'))  # Creates new column
print('>> Simple find one:', table.find_one(name='John Doe'))
print('>> Distinct values:', [*table.distinct('gender')])

table.update(dict(name='John Doe', age=37, gender='male'), ['name', 'age'])
table.upsert(dict(prim_id=3, name='Jane Doe', age=47, gender='female'), ['name', 'age'])
print('>> Simple find in list:', [*table.find(age=[34, 99])])
print('>> More expressive find:', [*table.find(name={'<>': 'Michael'}, age={'between': [20, 40]})])
# Find can use: `gt, >; || lt, <; || gte, >=; || lte, <=; || !=, <>, not; || between, ...etc.`

table.delete(age=34)  # WARN: If no arguments are given, all records are deleted

# Print some meta data on the database
print('>> MetaData about the database:', db.tables, db[table_name].columns, len(db[table_name]))

# Convert to pandas dataframe
df_table = pd.DataFrame([*table.all()])
print('>> Table as dataframe:', df_table)

# Remove the table entirely from the dataset
table.drop()
print('>> The table was dropped:', db.tables)


# Variations of creating/accessing tables
#   Warn: after reaching one of these error states, the db instance needs to be recreated
table = db.load_table(table_name)
try:
    print(table)  # Raises an error because the table did not exist. Note that db.load_table does not error
except dataset.util.DatasetException as err:
    print('>> from `db.load_table(table_name)`:', err)
table = db[table_name]
try:
    print(table)  # Raises an error because the table did not exist. Note that db[*] does not error
except dataset.util.DatasetException as err:
    print('>> from `db[table_name]`:', err)
```

## funcy

[Main Documentation](https://funcy.readthedocs.io/en/stable/cheatsheet.html)

[Cheatsheet](https://funcy.readthedocs.io/en/stable/cheatsheet.html)

## Pandas

[Main Documentation](https://pandas.pydata.org/pandas-docs/stable/reference/index.html)

### Modify print format ([docs](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.set_option.html))

```py
import pandas as pd

# Enable all columns to be displayed at once (or tweak to set a new limit)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', None)

# Optionally modify number of rows shown
pd.set_option('display.max_rows', None)
```

### pd DataFrame.from_records ([docs](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.from_records.html))

```py
import pandas as pd

data = [(1, 'a'), (2, 'b'), (3, 'c'), (4, 'd')]
pd.DataFrame.from_records(data, columns=['numbers', 'letters'])
```

### itertuples ([docs](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.itertuples.html))

```py
import pandas as pd

df = pd.DataFrame({'num_legs': [4, 2], 'num_wings': [0, 2]},
                  index=['dog', 'hawk'])
for row in df.itertuples(index=False):
    print(row)
```

## Filter

```py
import pandas as pd
import nump as np

np.random.seed([3,1415])
df = pd.DataFrame(
    np.random.randint(10, size=(10, 5)),
    columns=list('ABCDE')
)

# Multiple conditions
df[(df.A == 1) & (df.D == 6)]
df[((df.A==1) == True) | ((df.D==6) == True)]

# Pipes
value = 10
df.pipe(lambda x: x['A'] == value)

# String Query syntax
df.query('D > B').query('C > B')
# (or combined)
df.query('D > B and C > B')
```

Also see: https://stackoverflow.com/a/11872393/3219667

## Plotly

[Main documentation](https://plotly.com/python/)

### px

[px documentation](https://plotly.com/python/plotly-express/)

### line charts ([docs](https://plotly.com/python/line-charts/))

```py
import plotly.express as px

df = px.data.gapminder().query("continent=='Oceania'")
fig = px.line(df, x="year", y="lifeExp", color='country')
fig.show()
```

Or display as sparklines (note: minimal modification)

```py
import plotly.express as px

df = px.data.stocks(indexed=True)
fig = px.line(df, facet_row="company", facet_row_spacing=0.01, height=200, width=300)

# # Hide and lock down axes
# fig.update_xaxes(visible=False, fixedrange=True)
fig.update_yaxes(visible=False, fixedrange=True)

# Remove facet/subplot labels
fig.update_layout(annotations=[], overwrite=True)

# Strip down the rest of the plot
fig.update_layout(
    showlegend=False,
    # plot_bgcolor="white",  # Otherwise has a light grey background for each subplot (according to theme)
    margin=dict(t=5,l=5,b=5,r=5)
)

# Disable the modebar for such a small plot
fig.show(config=dict(displayModeBar=False))
```

## PyTest

[Main Documentation](https://docs.pytest.org/en/latest)

### commands (assumes using poetry) ([docs](https://docs.pytest.org/en/latest/usage.html))

```sh
poetry run pytest -l --ff
poetry run pytest -x -l --ff -v

# If coverage installed (https://pypi.org/project/coverage/)
poetry run pytest -x -l --ff -v --cov-report=html:"cov_html" --cov=package_name --html="TestReport.html" --self-contained-html

# If pytest-watch installed (https://pypi.org/project/pytest-watch/)
poetry run ptw -- -m "CURRENT"
poetry run ptw -- -m "not CHROME"
```

### markers ([docs](https://docs.pytest.org/en/latest/mark.html))

In `conftest.py`:

```py
def pytest_configure(config):
    """Configure pytest with custom markers.

    Args:
        config: pytest configuration object

    """
    config.addinivalue_line(
        'markers',
        'SLOW: marks slow tests. Can be skipped with `-m "not SLOW"`',
    )
    # Add additional markers by calling `config.addinivalue_line()` again
```

In any test file:

```py
import pytest

@pytest.mark.SLOW
def test_something():
    pass

# For more compact assignment of multiple markers,
#   see `funcy.compose(pytest.mark.one, pytest.mark.two)`
```

### parametrize ([docs](https://docs.pytest.org/en/stable/parametrize.html))

```py
import pytest

@pytest.mark.parametrize('arg_1, arg_2', [
    ('value_1', 'value_2'),
])
def test_something(arg_1, arg_2):
    """Test test_something."""
    assert arg_1 != arg_2

```

## Data Version Control (DVC) ([Docs](https://dvc.org/doc/start))

Additionally see [this user's notes on implementation](https://github.com/lalitdutt/DVC_for_DataScience), [DVC/data-versioning](https://dvc.org/doc/start/data-versioning) and [DVC/dvc-files-and-directories](https://dvc.org/doc/user-guide/dvc-files-and-directories).

```sh
# For a new poetry-dvc project
poetry run dvc init
git add .; git commit -m "New: Initialize DVC"

# To track a hypothetical data.sqlite. Run this command, which should generate a data.dvc file to check in to VCS
poetry run dvc add data.sqlite
git add .; git commit -m "Chg: Versioned data.sqlite"

# When you checkout a branch or specific commit, use dvc checkout to get the correspondingly versioned data
git checkout <sha/branch>
poetry run dvc checkout
# You can also just checkout a specific version of a file:
git checkout HEAD^1 data.sqlite
poetry run dvc checkout
git add data.sqlite; git commit -m "Chg: reverted changes to data.sqlite"

# Create synced remote for DVC to use to store data versions (File path, AWS, etc.)
poetry run dvc remote list
poetry run dvc remote add -d local_remote ~/Developer/dvc/project_1
poetry run dvc push

# TBD: I think there might be more notes on using `dvc pull`
```

## Pandera: Pandas Schemas (WIP)

[Pandera - Docs](https://pandera.readthedocs.io/en/stable/)

- Example snippets below
- Note that `black`/`autopep8` is required only for using `script = io.to_script(schema_to_write)`
- In 0.4.0 there is an experimental infer method: https://pandera.readthedocs.io/en/stable/schema_inference.html

```py
import pandas as pd
import pandera as pa
from icecream import ic
from pandera import Check, Column, DataFrameSchema, Int

# data to validate
df_raw = pd.DataFrame({
    'column1': [1, 4, 0, 10, 9],
    'column2': [-1.3, -1.4, -2.9, -10.1, -20.4],
    'column3': ['value_1', 'value_2', 'value_3', 'value_2', 'value_1'],
})

# define schema
schema = pa.DataFrameSchema({
    'column1': pa.Column(pa.Int, checks=pa.Check.less_than_or_equal_to(10)),
    'column2': pa.Column(pa.Float, checks=pa.Check.less_than(-1.2)),
    'column3': pa.Column(pa.String, checks=[
        pa.Check.str_startswith('value_'),
        # Define custom checks as functions that take a series as input and outputs a boolean or boolean Series
        pa.Check(lambda s: s.str.split('_', expand=True).shape[1] == 2),
    ]),
})

validated_df_raw = schema.validate(df_raw)  # PASSES Validation - would otherwise raise pandera.errors.SchemaError
ic(validated_df_raw)  # noqa: T001

# -----------------------------

# Demo the Experimental Schema Inference interface
schema = pa.infer_schema(df_raw)
ic(schema)

ic('Pandera to script which requires black/autopep8')
print(pa.io.to_script(schema))

# -----------------------------

simple_schema = DataFrameSchema({
    'column1': Column(Int, Check(lambda x: 0 <= x <= 10, element_wise=True, error='range checker [0, 10]')),
})

# Validation rule violated
fail_check_df = pd.DataFrame({
    'column1': [-20, 5, 10, 30],
})
# simple_schema.validate(fail_check_df)
# #   pandera.errors.SchemaError: <Schema Column: 'column1' type=int> failed element-wise validator 0:
# #   <Check <lambda>: range checker [0, 10]>
# #   failure cases:
# #      index  failure_case
# #   0      0           -20
# #   1      3            30

# Column name missing
wrong_column_df = pd.DataFrame({
    'foo': ['bar'] * 10,
    'baz': [1] * 10,
})
# simple_schema.validate(wrong_column_df)
# #   pandera.errors.SchemaError: column 'column1' not in dataframe
# #      foo  baz
# #   0  bar    1
# #   ...
```

## isort

Useful snippet when debugging isort settings: `isort . --show-config`

## Conda

Create environment at specified version

```sh
conda create --name py390 python=3.9.0
conda activate py390
conda deactivate
```

Update global Python version: `conda install python=3.10.0`

## Logging with Loguru ([docs](https://github.com/Delgan/loguru))

[gto76 Loguru Cheatsheet](https://github.com/gto76/python-cheatsheet#logging)

<!-- FIXME: Cleanup and push changes -->

- TODO: Show an example with bound context, useful for adding an attribute to identify the class? Could be used with self.logger.debug()
- PLANNED: `logger.add(sys.stderr, filter='my_module')`
- PLANNED: Show enable/disable from dash_dev
- PLANNED: Replace [old parsers for text files](https://loguru.readthedocs.io/en/stable/api/logger.html#loguru._logger.Logger.parse)

```py
import logging
import sys

from loguru import logger

# TODO: See https://loguru.readthedocs.io/en/stable/api/logger.html#loguru._logger.Logger.remove
logger.remove()  # Clear default stderr/stdout logger 0?
logger.add(sys.stdout, level=logging.INFO)
logger.add('debug_{time}.jsonl', retention='2 minutes', serialize=True)
logger.add('error.log', level=logging.ERROR)

logger.warning('A logging warning.')
logger.debug('A logging debug.')
logger.info('A logging info.')
logger.error('A logging error.')
logger.exception('A logging exception.')

# logger.add('file.log', format='{extra[ip]} {extra[user]} {message}')
# context_logger = logger.bind(ip='192.168.0.1', user='someone')
# context_logger.info('Contextualize your logger easily')
# context_logger.bind(user='someone_else').info('Inline binding of extra attribute')
# > You can also have more fine-grained control over your logs by combining bind() and filter:
# logger.add('special.log', filter=lambda record: 'special' in record['extra'])
# logger.debug('This message is not logged to the file')
# logger.bind(special=True).info('This message, though, is logged to the file!')
# > Finally, the patch() method allows dynamic values to be attached to the record dict of each new message:
# logger.add(sys.stderr, format='{extra[utc]} {message}')
# logger = logger.patch(lambda record: record['extra'].update(utc=datetime.utcnow()))

with logger.contextualize(task='task_id'):
    logger.info('End of task')

# TODO: See the https://github.com/Delgan/loguru/issues/310
with logger.catch(message='Because we never know...', reraise=False):
    raise FileNotFoundError('Testing logger.catch')

# If you need to handle your own try/catch blocks
try:
   raise FileNotFoundError('Testing logger.catch')
except FileNotFoundError:
    logger.exception('Because we never know...')
```

### For Packages

Rules:

- Never call `logger.add(...)`. Use `logger.configure(...)` instead
- Call `logger.disable(__pkg_name__)`, which is done automatically by dash_dev when generating documentation
- A developer can later use `logger.enable(__pkg_name__)`

```py
LOG_DIR = Path(__file__).resolve().parent / '.logs'
"""Output directory for log files."""
LOG_DIR.mkdir(exist_ok=True)

LOGGER_CONFIG = {
    'handlers': [
        {'sink': LOG_DIR / 'pkg.jsonl', 'mode': 'w', 'serialize': True, 'level': logging.DEBUG},
        {'sink': LOG_DIR / 'pkg.log', 'mode': 'w', 'level': logging.INFO},
    ],
    'extra': {'package': __pkg_name__},
}
"""Loguru configuration. Note: loguru logging for this package is deactivated by default and must be activated."""
logger.configure(**LOGGER_CONFIG)

# For libraries
logger.disable(__pkg_name__)
logger.info('No matter added sinks, this message is not displayed')
logger.enable(__pkg_name__)
logger.info('This message however is propagated to the sinks')
```

### General Logging Notes

Careful select the log level:

- *DEBUG*: capture intermediary and verbose information that will assist with development. Expect this to be disabled for production uses
- *INFO*: capture branch points and expected events so that the context can be deciphered from the logs
  - Entering and exit webpages
  - Starting and stopping steps or long processes
  - Login/logout
  - Other operations/actions
- *WARNING*: capture unusual or unexpected events, but not errors
  - Unexpected values are encountered
  - A batch or step takes longer than expected
- *ERROR*: capture expected errors handled and recovered by the app
  - APIs returning an error result
  - Request time out
  - Optional component not available, but requested
  - Note to reduce noise, some benign and common errors that are properly handled, such as input validation, could go in warning
- *CRITICAL*: catch critical errors that prevent usage of the tool

Additionally, write logs asynchronously to a buffer or queue so the application can keep running for time-sensitive components

### Loguru: Custom Sinks

[Based on this discussion](https://github.com/Delgan/loguru/pull/205#issuecomment-577379512):

FIXME: test and replace with something that can write to a file with the simpler record dataset

```py
def json_sink(message):
    record = message.record
    reduced = dict(
        time=record['time'],
        module=record['module'],
        level=record['level'].name,
        function=record['function'],
        line=record['line'],
        message=record['message'],
        extra=record['extra'],
    )
    serialized = json.dumps(reduced)
    print(serialized)

logger.add(json_sink)
```

[Based on this discussion](https://github.com/Delgan/loguru/issues/203#issuecomment-592183529):

```py
def sink_serializer(message):
    record = message.record
    simplified = {
        'level': record['level'].name,
        'message': record['message'],
        'timestamp': record['time'].timestamp(),
    }
    serialized = json.dumps(simplified)
    print(serialized, file=sys.stderr)

logger.add(sink_serializer, level='INFO', format='{level}: {time} [{name}] {message}')
```

### Loguru: Async

[Based on this discussion](https://github.com/Delgan/loguru/issues/268#issuecomment-631616065):

```py
import asyncio
from loguru import logger


async def api_post(message):
    await asyncio.sleep(1)
    print('Async http post:', message)


async def publish(message):
    await api_post(message)


async def main():
    logger.info('Entry')
    await asyncio.sleep(0.5)
    logger.info('Exit')
    await logger.complete()  # Ensure that the log messages have been captured


if __name__ == '__main__':
    logger.add(publish, serialize=True)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
```

### Encrypted Logs?

From: https://github.com/Delgan/loguru/issues/332#issuecomment-699645995

```py
import better_exceptions

def encrypted_formatter(record):
    encrypted_message = cipher.encrypt(record['message'].encode('utf8'))
    record['extra']['encrypted_message'] = b64encode(encrypted_message).decode('latin1')

    encrypted_exception = cipher.encrypt(better_exceptions.format_exception(*record['exception']).encode('utf8'))
    record['extra']['encrypted_exception'] = b64encode(encrypted_exception).decode('latin1')
    return '[{level}] {extra[encrypted_message]}\n{extra[encrypted_exception]}'
```

For production output, use:

```py
import sys

# PLANNED: Test this
logger.add(sys.stdout, backtrace=True, diagnose=False)
```
