# Python Snippets

Useful Python snippets

- [Python Snippets](#python-snippets)
  - [Plain Python](#plain-python)
    - [tempfile TemporaryDirectory (docs)](#tempfile-temporarydirectory-docs)
    - [logging (docs)](#logging-docs)
      - [logging.basicConfig (docs)](#loggingbasicconfig-docs)
      - [Rotating File Handler (Docs)](#rotating-file-handler-docs)
      - [Timed Rotating File Handler (Docs)](#timed-rotating-file-handler-docs)
  - [Dataset](#dataset)
  - [funcy](#funcy)
  - [Pandas](#pandas)
    - [Modify print format (docs)](#modify-print-format-docs)
    - [pd DataFrame.from_records (docs)](#pd-dataframefrom_records-docs)
    - [itertuples (docs)](#itertuples-docs)
  - [Plotly](#plotly)
    - [px](#px)
    - [line charts (docs)](#line-charts-docs)
  - [PyTest](#pytest)
    - [commands (assumes using poetry) (docs)](#commands-assumes-using-poetry-docs)
    - [markers (docs)](#markers-docs)
    - [parametrize (docs)](#parametrize-docs)

## Plain Python

[Main Documentation](https://docs.python.org/3.9/)

### tempfile TemporaryDirectory ([docs](https://docs.python.org/3.8/library/tempfile.html#tempfile.TemporaryDirectory))

```py
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as td:
    tmp_dir = Path(td)
```

### logging ([docs](https://docs.python.org/3.8/library/logging.html))

Snippets demonstrating use of the Python logging module

#### logging.basicConfig ([docs](https://docs.python.org/3.8/library/logging.html#logging.basicConfig))

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

#### Rotating File Handler ([Docs](https://docs.python.org/3/library/logging.handlers.html#rotatingfilehandler))

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


#### Timed Rotating File Handler ([Docs](https://docs.python.org/3/library/logging.handlers.html#timedrotatingfilehandler))

Example once per minute: `handlers.TimedRotatingFileHandler(log_path, when='M', interval=1)`

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
