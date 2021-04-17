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

import csv
import os
import time
from operator import itemgetter
from typing import Dict, List

from dagster import (ModeDefinition, PresetDefinition, composite_solid, default_executors,
                     execute_pipeline, execute_solid, fs_io_manager, pipeline, reconstructable, solid)
from dagster.core.execution.context.compute import SolidExecutionContext
from dagster.experimental import DynamicOutput, DynamicOutputDefinition
from dagster_dask import dask_executor

SLEEP = 0.1


# @solid(config_schema={'max_cereal': int})
# def load_cereals(context: SolidExecutionContext) -> List[Dict[str, str]]:
#     """Docstring for load_cereals.
#
#     Args:
#         context: SolidExecutionContext
#
#     Results:
#         str: some string
#
#     """
#     dataset_path = os.path.join(os.path.dirname(__file__), 'cereal.csv')
#     with open(dataset_path, 'r') as fd:
#         cereals = [*csv.DictReader(fd)]
#     return cereals[:context.solid_config['max_cereal']]


@solid(
    config_schema={'max_cereal': int},
    output_defs=[DynamicOutputDefinition(List[Dict[str, str]])],
)
def load_cereals(context: SolidExecutionContext):
    """Docstring for load_cereals.

    Args:
        context: SolidExecutionContext

    Yields:
        List[Dict[str, str]]: Cereals

    """
    dataset_path = os.path.join(os.path.dirname(__file__), 'cereal.csv')
    with open(dataset_path, 'r') as fd:
        cereals = [*csv.DictReader(fd)]
    for max_cereal in range(2, context.solid_config['max_cereal'] + 3):
        yield DynamicOutput(
            value=cereals[:max_cereal],
            mapping_key=f'max_cereal_{max_cereal}',  # Must be a valid function name (i.e. no dashes)
        )


@solid
def get_most_calories(context: SolidExecutionContext,
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
def get_most_protein(context: SolidExecutionContext,
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
def log_results(context: SolidExecutionContext, *,
                most_calories: str, most_protein: str) -> str:
    """Docstring for log_results.

    Args:
        context: SolidExecutionContext

    Results:
        str: sum of string lengths

    """
    context.log.info(f'Most caloric cereal: {most_calories}')
    context.log.info(f'Most protein-rich cereal: {most_protein}')
    return f'{len(most_calories)}--{len(most_protein)}'


@composite_solid
def process_cereal(cereals: List[Dict[str, str]]) -> str:
    # Doesn't work to pass non-output as an input
    # get_most_calories = get_most.alias('get_most_calories')
    # get_most_protein = get_most.alias('get_most_protein')
    # most_calories = get_most_calories(cereals, 'calories')
    # most_protein = get_most_protein(cereals, 'protein')

    most_calories = get_most_calories(cereals)
    most_protein = get_most_protein(cereals)

    return log_results(most_calories=most_calories, most_protein=most_protein)


@solid
def display_cereal_results(context: SolidExecutionContext, cereal_results) -> None:
    context.log.info(f'cereal_results={cereal_results}')


# --------------------------------------------------------------------------------------


@pipeline(
    preset_defs=[
        PresetDefinition(name='default', run_config={
            'solids': {'load_cereals': {'config': {'max_cereal': 8}}},
            'execution': {'dask': {'config': {
                'cluster': {'local': {}},  # Test Dask parallelism only in dagit
            }}},
        }),
    ],
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
    cereal_results = cereals.map(process_cereal)
    display_cereal_results(cereal_results.collect())


reconstructable_complex_pipeline = reconstructable(complex_pipeline)


# --------------------------------------------------------------------------------------


# https://docs.dagster.io/_apidocs/execution#dagster.execute_solid
def test_get_most_calories():
    cereals = [{'calories': '1', 'name': 'one'}, {'calories': '2', 'name': 'two'}]

    result = execute_solid(get_most_calories, input_values={'cereals': cereals})

    # https://docs.dagster.io/_apidocs/execution#dagster.SolidExecutionResult
    assert result.success
    assert result.output_value('result') == 'two', result.output_values


def test_complex_pipeline():
    run_config = {
        'solids': {'load_cereals': {'config': {'max_cereal': 1}}},
    }

    result = execute_pipeline(complex_pipeline, run_config=run_config)

    assert result.success
    assert len(result.solid_result_list) > 2
    for solid_res in result.solid_result_list:
        assert solid_res.success


if __name__ == '__main__':
    # test_get_most_calories()
    # test_complex_pipeline()

    # Can also be a yaml file passed to CLI with "-c" for test vs. production
    # https://docs.dagster.io/tutorial/intro-tutorial/configuring-solids
    run_config = {
        'solids': {'load_cereals': {'config': {'max_cereal': 4}}},
        # 'execution': {'dask': {'config': {
        #     'cluster': {'local': {}},  # Test Dask parallelism only in dagit
        #     # 'cluster': {'local': {'n_workers': 1, 'threads_per_worker': 4}},
        #     # DagsterUnmetExecutorRequirementsError: You have attempted to use an executor that uses multiple processes with the pipeline "complex_pipeline" that is not reconstructable. Pipelines must be loaded in a way that allows dagster to reconstruct them in a new process. This means:
        #     # * using the file, module, or repository.yaml arguments of dagit/dagster-graphql/dagster
        #     # * loading the pipeline through the reconstructable() function
        # }}},
    }
    result = execute_pipeline(complex_pipeline, run_config=run_config)

    # > PLANNED: max_cereals = [*range(2, 5)]
    # Maybe: https://stackoverflow.com/questions/61330816/how-would-you-parameterize-dagster-pipelines-to-run-same-solids-with-multiple-di

    # result = execute_pipeline(complex_pipeline, preset='default')
    # result = execute_pipeline(reconstructable_complex_pipeline, preset='default')
