# ---
# jupyter:
#   jupytext:
#     formats: ipynb,py:percent
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.6.0
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
# # Experimenting with AST
#
# For dash_dev, I want to be able to create a table of contents of classes, methods, and functions with their respective signatures and docstring. AST is overkill for this, but it will be a useful building block for generating PlantUML in the future

# %%
from pprint import pprint
import ast
from inspect import signature
from pathlib import Path
from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = "all"

# %%
CWD = Path().cwd()
CWD

source_code = CWD / 'example.py'
tree = ast.parse(source_code.read_text())


# %%
def dump_fields(stmt):
    for field in stmt._fields:
        print(f'{field}: {getattr(stmt, field)}')
    for attribute in stmt._attributes:
        print(f'{attribute}: {getattr(stmt, attribute)}')

def inspect_func(stmt):
    print(f'\nFunc! {stmt.name} ({stmt.lineno}) -> {stmt.returns}')
    for arg in ast.walk(stmt.args):
        dump_fields(arg)

def inspect_class(stmt):
    print(f'\nClass! {stmt.name} ({stmt.lineno})')
    dump_fields(stmt)

state_types = []
for stmt in ast.walk(tree):
    state_types.append(type(stmt))
    if isinstance(stmt, ast.FunctionDef):
        inspect_func(stmt)
        break
    elif isinstance(stmt, ast.ClassDef):
        inspect_class(stmt)

print(f'\nstate_types={set(state_types)}')

# %%
# From: https://julien.danjou.info/python-ast-checking-method-declaration/
# for stmt in ast.walk(self.tree):
#     # Ignore non-class
#     if not isinstance(stmt, ast.ClassDef):
#         continue
# 
#     # If it's a class, iterate over its body member to find methods
#     for body_item in stmt.body:
#         # Not a method, skip
#         if not isinstance(body_item, ast.FunctionDef):
#             continue
# 
#         # Check that it has a decorator
#         for decorator in body_item.decorator_list:
#             # We hope that nothing is overwriting the
#             # 'staticmethod' name earlier, but that would be a
#             # BAAAAD practice anyway!
#             if (isinstance(decorator, ast.Name)
#                 and decorator.id == 'staticmethod'):
#                 # It's a static function, it's OK
#                 break
#             # If we are on Python < 3 and the method is declared
#             # abstract using ABC, we ignore it as it's impossible to
#             # declare it static, we need the abstractstaticmethod
#             # provided by Python 3 We could return different result
#             # based on the fact we are running Python 3 or not, but
#             # since most projects are hybrid, let's ignore this even on
#             # Python 3 for now.
#             if (isinstance(decorator, ast.Attribute)
#                 and decorator.attr == 'abstractmethod'
#                 and isinstance(decorator.value, ast.Name)
#                 and decorator.value.id == 'abc'):
#                 break
#         else:
#             try:
#                 first_arg = body_item.args.args[0]
#             except IndexError:
#                 # Check if it has *args instead
#                 if not body_item.args.vararg:
#                     yield (
#                         body_item.lineno,
#                         body_item.col_offset,
#                         "H905: method missing first argument",
#                         "H905",
#                     )
#                 # Check next method
#                 continue
#             for func_stmt in ast.walk(body_item):
#                 if six.PY3:
#                     if (isinstance(func_stmt, ast.Name)
#                         and first_arg.arg == func_stmt.id):
#                         # The first argument is used, it's OK
#                         break
#                 else:
#                     if (func_stmt != first_arg
#                         and isinstance(func_stmt, ast.Name)
#                         and func_stmt.id == first_arg.id):
#                         # The first argument is used, it's OK
#                         break
#             else:
#                 yield (
#                     body_item.lineno,
#                     body_item.col_offset,
#                     "H904: method should be declared static",
#                     "H904",
#                 )

# %%
# Examples based on: https://python-ast-explorer.com/

sample_func = """
def bar():
    with open('foo.txt') as fp:
      print(fp)
"""

sample_class = """
# Example: simple classes
class Foo(object):
  def __init__(self):
    pass

class Bar:
  def __init__(self):
    pass
"""

sample_decorator = """
# Example: decorating 
def shift(fn):
  def wrapped(p, n, s):
    return fn([s, p, n])

  return wrapped
  
@shift
def foo(arg):
    print(arg)
    
foo(1, 2, 3)
"""

sample_lambda = """
# Example: a lambda
f = lambda n: n * 2
"""

# %%

# %% [markdown]
# Also, just consider tokenization for faster lookup of all class and function definitions
# https://stackoverflow.com/questions/38180661/how-to-print-signatures-of-all-functions-methods-in-a-python-project
