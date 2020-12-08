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

PLANNED: https://github.com/crazyguitar/pysheeet/blob/master/docs/appendix/python-concurrent.rst and https://github.com/crazyguitar/pysheeet/blob/master/docs/appendix/python-asyncio.rst

## Profiling

PLANNED: [gto76/python-cheatsheet#profiling](https://github.com/gto76/python-cheatsheet#profiling)

## Redirect STDOUT

See: https://stackoverflow.com/a/62397337/3219667 or: https://stackoverflow.com/a/12111817/3219667

```py
from contextlib import redirect_stdout
from io import StringIO

_stdout = StringIO()
try:
    with redirect_stdout(_stdout):
        for idx in range(20):
            print(f'{idx}...')
finally:
    logger.info(_stdout.getvalue())
```

## WIP

<!--

# Context can be useful, but you need to be careful because it can be finicky if any fields are missing
import sys
logger.remove(0)
logger.add(sys.stdout, format='{extra[ip]} {extra[user]} {message}')
context_logger = logger.bind(ip='192.168.0.1', user='someone')
context_logger.info('Contextualize your logger easily')
context_logger.bind(user='someone_else').info('Inline binding of extra attribute ({extra[user]} nor {user})')
context_logger.info('Use kwargs to add context during formatting: {user}', user='anybody')
# This will fail...
logger.info('This will fail for an error that ip was not bound')

-->


<!-- TODO: Merge this notes with Pandas -->

https://calmcode.io/patsy/introduction.html

```py
import patsy as ps
import numpy as np
import pandas as pd
import matplotlib.pylab as plt

from sklearn.linear_model import LinearRegression

df = pd.read_csv("birthdays.csv")

def clean_data(dataf):
    return (dataf
            .drop(columns=['Unnamed: 0'])
            .assign(date = lambda d: pd.to_datetime(d['date']))
            .groupby(['date', 'wday', 'month'])
            .agg(n_born=('births', 'sum'))
            .reset_index()
            .assign(yday = lambda d: d['date'].dt.dayofyear))

df_clean = df.pipe(clean_data)

# -------

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklego.preprocessing import PatsyTransformer

import matplotlib.pylab as plt

X = (df_clean
    .head(2000)
    .loc[lambda d: d['n_born'] > 2000]
    .assign(num_date = lambda d: date_to_num(d['date'])))
y = X['n_born']

pipe = Pipeline([
    ("patsy", PatsyTransformer("(cc(yday, df=12) + wday + num_date)**2")),
    ("scale", StandardScaler()),
    ("model", LinearRegression())
])

np.mean(np.abs(pipe.fit(X, y).predict(X) - y))

#
# Another variant of the pandas

import pandas as pd

df = pd.read_csv("birthdays.csv")

plot_df = (df
  .assign(date = lambda d: pd.to_datetime(d['date']))
  .assign(day_of_year = lambda d: d['date'].dt.dayofyear)
  .groupby('day_of_year')
  .agg(n_births=('births', 'sum'))
  .assign(p = lambda d: d['n_births']/d['n_births'].sum()))

plot_df.assign(p_fake = lambda d: 1/d.shape[0])[['p', 'p_fake']].plot()
plt.ylim(0);
```

===============================

## tqdm

```py
import tqdm

for outer in tqdm.tqdm([10, 20, 30, 40, 50], desc=" outer", position=0):
    for inner in tqdm.tqdm(range(outer), desc=" inner loop", position=1, leave=False):
        time.sleep(0.05)
print("done!")
```

More chaining

```py
class Clumper:
    def __init__(self, blob):
        self.blob = blob

    def keep(self, *funcs):
        data = self.blob
        for func in funcs:
            data = [d for d in data if func(d)]
        return Clumper(data)

    def head(self, n):
        return Clumper([self.blob[i] for i in range(n)])

    def tail(self, n):
        return Clumper([self.blob[-i] for i in range(1, n+1)])

    def select(self, *keys):
        return Clumper([{k: d[k] for k in keys} for d in self.blob])

    def mutate(self, **kwargs):
        data = self.blob
        for key, func in kwargs.items():
            for i in range(len(data)):
                data[i][key] = func(data[i])
        return Clumper(data)

    def sort(self, key, reverse=False):
        return Clumper(sorted(self.blob, key=key, reverse=reverse))

# Let's look at the query we're able to make now.

(Clumper(poke_dict)
  .keep(lambda d: 'Grass' in d['type'],
        lambda d: d['hp'] < 60)
  .mutate(ratio=lambda d: d['attack']/d['hp'])
  .select('name', 'ratio')
  .sort(lambda d: d['ratio'], reverse=True)
  .head(15)
  .blob)
```
