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
#     display_name: common_jupyter
#     language: python
#     name: common_jupyter
# ---

# %% [markdown]
# # Dotted Dict Experimentation
#
# 1. https://github.com/cdgriffith/Box
# 2. https://github.com/josh-paul/dotted_dict

# %%
from box import Box
movie_box = Box({ "Robin Hood: Men in Tights": { "imdb stars": 6.7, "length": 104 } })
print(movie_box.Robin_Hood_Men_in_Tights.imdb_stars)

movie_box = Box(Robin_Hood_Men_in_Tights={"imdb stars": 6.7, "length": 104 })
print(movie_box.Robin_Hood_Men_in_Tights.imdb_stars)

# %%
from dotted_dict import DottedDict
example = DottedDict({'bar': 2, 'foo': 1})
print(example.bar)

example = DottedDict(bar=2, foo=1)
print(example.bar)

# %%
