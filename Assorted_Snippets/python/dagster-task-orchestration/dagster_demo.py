"""Tutorial for Dagster.

```sh
# Run with Python or dagit:
poetry run python dagster_demo.py
poetry run dagit -f dagster_demo.py

# Set a persistent location for dagit to store metadata (otherwise in tmp directory)
# FIXME: This isn't actually working...
DAGSTER_HOME=$PWD/dagit-cache
ECHO $DAGSTER_HOME
mdkir $DAGSTER_HOME
poetry run dagit -p 80
```

"""

import time
import csv
import os
from operator import itemgetter
from typing import Dict, List, Optional

from dagster import ModeDefinition, default_executors, execute_pipeline, fs_io_manager, pipeline, solid, execute_solid
from dagster.core.execution.context.compute import SolidExecutionContext
from dagster_dask import dask_executor

SLEEP = 4


@solid(config_schema={'max_cereal': int})
def load_cereals(context: Optional[SolidExecutionContext]) -> List[Dict[str, str]]:
    """Docstring for load_cereals.

    Args:
        context: SolidExecutionContext

    Results:
        str: some string

    """
    dataset_path = os.path.join(os.path.dirname(__file__), 'cereal.csv')
    with open(dataset_path, 'r') as fd:
        cereals = [*csv.DictReader(fd)]
    return cereals[:context.solid_config['max_cereal']]


@solid
def get_most_calories(context: Optional[SolidExecutionContext],
                      cereals: List[Dict[str, str]]) -> str:
    """Docstring for get_most_calories.

    Args:
        context: SolidExecutionContext

    Results:
        str: some string

    """
    sorted_cereals = [*sorted(cereals, key=itemgetter('calories'))]
    time.sleep(SLEEP + 0.5)
    return sorted_cereals[-1]['name']


@solid
def get_most_protein(context: Optional[SolidExecutionContext],
                     cereals: List[Dict[str, str]]) -> str:
    """Docstring for get_most_protein.

    Args:
        context: SolidExecutionContext

    Results:
        str: some string

    """
    sorted_cereals = [*sorted(cereals, key=itemgetter('protein'))]
    time.sleep(SLEEP)
    return sorted_cereals[-1]['name']


@solid
def log_results(context: Optional[SolidExecutionContext], *,
                most_calories: str, most_protein: str) -> None:
    """Docstring for log_results.

    Args:
        context: SolidExecutionContext

    Results:
        str: some string

    """
    context.log.info(f'Most caloric cereal: {most_calories}')
    context.log.info(f'Most protein-rich cereal: {most_protein}')


@pipeline(
    mode_defs=[
        ModeDefinition(
            resource_defs={'io_manager': fs_io_manager},
            executor_defs=default_executors + [dask_executor],
        ),
    ],
)
def complex_pipeline() -> None:
    """Docstring for complex_pipeline."""
    cereals = load_cereals()
    most_calories = get_most_calories(cereals)
    most_protein = get_most_protein(cereals)
    log_results(most_calories=most_calories, most_protein=most_protein)


# https://docs.dagster.io/_apidocs/execution#dagster.execute_solid
def test_get_most_calories():
    cereals = [{'calories': '1', 'name': 'one'}, {'calories': '2', 'name': 'two'}]

    result = execute_solid(get_most_calories, input_values={'cereals': cereals})

    # https://docs.dagster.io/_apidocs/execution#dagster.SolidExecutionResult
    assert result.success
    assert result.output_value('result') == 'two', result.output_values


def test_complex_pipeline():
    run_config = {
        'solids': {'load_cereals': {'config': {'max_cereal': 8}}},
    }

    result = execute_pipeline(complex_pipeline, run_config=run_config)

    assert result.success
    assert len(result.solid_result_list) == 4
    for solid_res in result.solid_result_list:
        assert solid_res.success


if __name__ == '__main__':
    test_get_most_calories()
    test_complex_pipeline()

    # Can also be a yaml file passed to CLI with "-c" for test vs. production
    # https://docs.dagster.io/tutorial/intro-tutorial/configuring-solids
    run_config = {
        'solids': {'load_cereals': {'config': {'max_cereal': 8}}},

        # https://docs.dagster.io/_apidocs/libraries/dagster-dask#dagster_dask.dask_executor
        'execution': {'dask': {'config': {
            # 'cluster': {'local': {'n_workers': 1, 'threads_per_worker': 2}},
            'cluster': {'local': {}},  # Test Dask parallelism only in dagit
        }}},
    }

    # > PLANNED: max_cereals = [*range(2, 5)]
    result = execute_pipeline(complex_pipeline, run_config=run_config)
