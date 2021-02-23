# Jupyter Notebooks

You will need Python (I recommend `miniconda`), Git, and NodeJS for most of these instructions. For NodeJS, on a Mac, use `brew` and `nvm`, while on Windows, using `conda install nodejs` is probably easiest

I have a workflow for getting the most out of Jupyter that I think could be helpful to others

- Use poetry virtual environments
- Use jupytext to pair the notebook file (JSON) with a percent file (py) for version control (the .ipynb file should be ignored)
- Install extensions that enforce Python best practices, linting, and formatting
- Utilize Plotly for visualizations

## Quick Start

```sh
# Install node.js - see above
# Install poetry, possibly create a new package or add to an existing project
poetry add jupyterlab ipykernel jupytext -D
# Add additional packages fromt he section below. Some need extra steps. Rebuild once packages are instaled
poetry run jupyter lab build
# Configure the poetry environment as a virtual environment for Jupyter
poetry run python -m ipykernel install --user --name replace_with_poetry_package_name
# See additional information here: https://janakiev.com/blog/jupyter-virtual-envs/
# Launch Jupyter Lab
poetry run jupyter lab
```

## Plugins

I highly recommend all of the below plugins, but you can pick and choose. Once you've installed the plugins, make sure to `poetry run jupyter lab build` or select rebuild in the UI when prompted

### Code Quality

TODO: Try [nbQA](https://github.com/nbQA-dev/nbQA) to run general code quality tools in Jupyter. Is there an equivalent for Jupyter Lab?

```sh
poetry run jupyter labextension install jupyterlab-jupytext jupyterlab-flake8 @ryantam626/jupyterlab_code_formatter @wallneradam/trailing_space_remover @julynter/labextension @ijmbarr/jupyterlab_spellchecker @krassowski/jupyterlab_go_to_definition @kiteco/jupyterlab-kite --no-build

poetry add jupyterlab_code_formatter autopep8 isort -D
jupyter serverextension enable --py jupyterlab_code_formatter
```

### [How to Use jupyterlab_code_formatter](https://jupyterlab-code-formatter.readthedocs.io/en/latest/how-to-use.html#how-to-use-this-plugin)

PLANNED: this wasn't working for me

“Settings” > “Advanced Settings Editor” > “Jupyterlab Code Formatter”, then in the “User Preferences” panel, enter, for example:

```json
{
    "preferences": {
        "default_formatter": {"python": ["isort", "autopep8"]}
    }
}
```

### Plotting

Based on [Plotly in Jupyter Lab by binnisb](https://binnisb.github.io/blog/datascience/2020/04/02/Plotly-in-lab.html#Plotly-in-Jupyter-Lab)

```sh
# Avoid "JavaScript heap out of memory" errors during extension installation (OS X/Linux)
export NODE_OPTIONS=--max-old-space-size=4096

# Jupyter widgets extension, Render, and FigureWidget support
poetry run jupyter labextension install @jupyter-widgets/jupyterlab-manager jupyterlab-plotly plotlywidget --no-build
# Build extensions (must be done to activate extensions since  is used above)
poetry run jupyter lab build

# Unset NODE_OPTIONS environment variable (OS X/Linux)
unset NODE_OPTIONS
```

### Themes

```sh
poetry run jupyter labextension install @arbennett/base16-monokai @ryantam626/jupyterlab_sublime --no-build
```

### General List

- @jupyter-widgets/jupyterlab-manager
- jupyterlab-flake8
- @ijmbarr/jupyterlab_spellchecker
- @julynter/labextension
- plotlywidget
- @kiteco/jupyterlab-kite
- @arbennett/base16-monokai
- jupyterlab-plotly
- jupyterlab-jupytext
- @krassowski/jupyterlab_go_to_definition
- PLANNED: try [dataflownb/ipycollections-extension](https://github.com/dataflownb/ipycollections-extension)

## Keyboard Shortcuts

- [Sublime Shortcuts](https://github.com/ryantam626/jupyterlab_sublime/blob/master/sublimeKeyChecklist.md) from the plugin `@ryantam626/jupyterlab_sublime `
- Multiple Cursors: <kbd>Ctrl</kdb> + Click
- [Splitting/Merging cells](https://stackoverflow.com/questions/63654380/how-to-split-and-merge-cells-in-jupyterlab)
  - Split on cursor(s): <kbd>Ctrl</kdb> + <kbd>Shift</kdb> + <kbd>-</kdb>
  - Merge: select adjacent cells while holding <kbd>Shift</kdb>, then tap <kbd>M</kdb>, and release both keys
- Useful notes from [15 Tips and Tricks for Jupyter Notebooks](https://towardsdatascience.com/15-tips-and-tricks-for-jupyter-notebook-that-will-ease-your-coding-experience-e469207ac95c) - note for Jupyter Notebooks specifically, but selected items work in Jupyter Lab
  - Autocompletion: write the name of the function you want to implement
    - Press Shift+Tab to view the documentation
    - Click on ^ on the top right corner of documentation to view it in a pager
    - Click on + to grow the docstring vertically
    - Click on x to close the docstring
  - Cells
    - Shit+Enter will run the current cell and highlight the next cell, if no cell is present it will create a new cell.
    - Alt+Enter will run the current cell and insert a new cell and highlight it.
  - Keyboard Shortcuts
    - `Help>Keyboard Shortcuts`
