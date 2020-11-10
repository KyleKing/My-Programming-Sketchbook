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

# %%
from pprint import pprint
from decouple import config
import tmdbsimple as tmdb
tmdb.API_KEY = config('TMDB_API_KEY')
movie = tmdb.Movies(603)
# print(movie)
response = movie.info()
# print(response)
print(movie.title)
print(movie.budget)

response = movie.releases()
# print(response)
for c in movie.countries:
    if c['iso_3166_1'] == 'US':
         print(c['certification'])

# %%
search = tmdb.Search()
response = search.movie(query='The Bourne')
for s in search.results:
     print(s['title'], s['id'], s.get('release_date', 'No Release Date'), s['popularity'])

# %%
genre = tmdb.Genres(2)
pprint({key: getattr(genre, key) for key in dir(genre) if not key.startswith('_')})

# %%
[_g['name'] for _g in genre.movie_list()['genres']]

# %%
response = movie.info()
response
dir(movie)

# %%
movie.vote_count

# %%
movie.budget

# %%
