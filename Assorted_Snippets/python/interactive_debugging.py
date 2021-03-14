"""Test Interactive Debugging (primarily for Pandas dataframes)."""

import shelve  # noqa: S403,DUO119

import dill  # noqa: S403
import pandas as pd

# ======================================================================================
"""Pickling Data.

A development process with experimentation might look like:

1. Write some code and add Shelve/Dill
1. (Optional breakpoint)
1. Load the shelved data in Jupyter for experimentation
1. Add snippets from experimentation. Rerun code
1. Remove shelve/dill.

Note: JSON is preferred for unknown data sources, but this approach is for internal debugging, so pickle/dill are fine:
    https://github.com/dlint-py/dlint/blob/master/docs/linters/DUO119.md

"""

raw_data = {
    'timestamp': [123455, 123456],
    'message': ['better log data', 'other log data'],
}  # PLANNED: Make a better example from loguru jsonl output
df_example = pd.DataFrame(raw_data, columns=[*raw_data.keys()])
print(df_example)  # noqa: T001

# --------------------------------------------------------------------------------------
# Example with shelve (pickle back-end)
#
# If not using writeback, some operations won't work as expected
#   See: https://docs.python.org/3/library/shelve.html#example
#   Note that writeback makes .close() slower and consumes more memory
shelf = shelve.open('shelf.db', writeback=True)  # noqa: S301
#
shelf['df_example'] = df_example
# Standard dictionary modifications apply
# > data = shelf[key]
# > del shelf[key]
#
shelf.close()

# Load the shelved data
load_shelf = shelve.open('shelf.db')  # noqa: S301
print(load_shelf['df_example'])  # noqa: T001
load_shelf.close()

# --------------------------------------------------------------------------------------
# Example with dill
local_data = {'df_example': df_example}
with open('dump.dill', 'wb') as dill_file:
    dill.dump(local_data, dill_file)

with open('dump.dill', 'rb') as dill_file:
    load_data = dill.load(dill_file)  # noqa: S301
    df_load = load_data['df_example']
    print(df_load)  # noqa: T001

# ======================================================================================
# Interactive Debuggers

# peepshow: https://github.com/gergelyk/peepshow
# Pending resolution on getch: https://github.com/gergelyk/peepshow/issues/2

# winpdb-reborn: https://github.com/bluebird75/winpdb
# ❯ poetry run python -m winpdb python/interactive_debugging.py
# N/A: Requires a framework build (pythonw in conda or from python.org)

# trepan3k: https://python3-trepan.readthedocs.io/en/latest/entry-exit.html#entering-the-trepan-debugger
# > trepan3k = "^1.2.0"
# > from trepan.api import debug
# > debug() # Get thee to thyne debugger!
# Useful: seems comparbale to pdbpp

# pdbpp/pdb++: https://github.com/pdbpp/pdbpp
# > pdbpp = "^0.10.2"
# Use breakpoint (or `pytest --pdb`)
# > breakpoint()  # noqa: B601,T100

# pudb: https://documen.tician.de/pudb/starting.html
# > pudb = "^2020.1"
# Either Set the environment vairable (demo shows with os.environ, but could be system-wide)
# > import os
# > os.environ['PYTHONBREAKPOINT'] = 'pudb.set_trace'
# > breakpoint()  # noqa: B601,T100
#
# Or use the import
# > import pudb
# > pu.db
# Overall pretty cool - can see variables on top right and terminal bottom left

print('Post-Debug')  # noqa: T001

# --------------------------------------------------------------------------------------
