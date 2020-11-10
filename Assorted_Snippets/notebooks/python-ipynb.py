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
# Example Jupter notebook file
#
# To support Plotly, install these dependencies ([link](https://binnisb.github.io/blog/datascience/2020/04/02/Plotly-in-lab.html#Plotly-in-Jupyter-Lab))
#
# ```sh
# # Make sure the local environment is configured
# poetry update
#
# # Avoid "JavaScript heap out of memory" errors during extension installation
# # (OS X/Linux)
# export NODE_OPTIONS=--max-old-space-size=4096
#
# # Jupyter widgets extension
# poetry run jupyter labextension install @jupyter-widgets/jupyterlab-manager --no-build
#
# # jupyterlab renderer support
# poetry run jupyter labextension install jupyterlab-plotly --no-build
#
# # FigureWidget support
# poetry run jupyter labextension install plotlywidget --no-build
#
# # Build extensions (must be done to activate extensions since --no-build is used above)
# poetry run jupyter lab build
#
# # Unset NODE_OPTIONS environment variable
# # (OS X/Linux)
# unset NODE_OPTIONS
# ```
#
# Now run with `poetry run jupyter lab`

# %%
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

# # Disable the modebar for such a small plot
# fig.show(config=dict(displayModeBar=False))

# %%
