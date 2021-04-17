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
from datetime import datetime, time
from operator import itemgetter
from time import sleep
from typing import Dict, List

from dagster import (ModeDefinition, PresetDefinition, composite_solid, daily_schedule, default_executors,
                     execute_pipeline, execute_solid, fs_io_manager, pipeline, repository, solid)
from dagster.core.execution.context.compute import SolidExecutionContext
from dagster.experimental import DynamicOutput, DynamicOutputDefinition

SLEEP = 0.1

# FIXME: Stop on first failure?


@solid(
    config_schema={'max_cereal': int},
    output_defs=[DynamicOutputDefinition(List[Dict[str, str]])],
)
def load_cereals(context: SolidExecutionContext, date: str):
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
             # Must be a valid function name (i.e. no dashes)
            mapping_key=f'max_cereal_{max_cereal}_{date}'.replace('-', '_'),
        )


@solid
def get_most_calories(context: SolidExecutionContext, cereals: List[Dict[str, str]]) -> str:
    """Docstring for get_most_calories.

    Args:
        context: SolidExecutionContext
        cereals: list

    Results:
        str: cereal name

    """
    sorted_cereals = [*sorted(cereals, key=itemgetter('calories'))]
    sleep(SLEEP + 0.5)
    return sorted_cereals[-1]['name']


@solid
def get_most_protein(context: SolidExecutionContext, cereals: List[Dict[str, str]]) -> str:
    """Docstring for get_most_protein.

    Args:
        context: SolidExecutionContext
        cereals: list

    Results:
        str: cereal name

    """
    sorted_cereals = [*sorted(cereals, key=itemgetter('protein'))]
    sleep(SLEEP)
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
            'solids': {'load_cereals': {
                'config': {'max_cereal': 8},
                'inputs': {'date': '2021-03-01'},
            }},
            'execution': {'multiprocess': {'config': {
                'max_concurrent': 10,
            }}},
            # 'intermediate_storage': {'filesystem': {}}, # Duplicate of io_manager
        }),
        PresetDefinition(name='local', run_config={
            'solids': {'load_cereals': {
                'config': {'max_cereal': 2},
                'inputs': {'date': '2021-01-02'},
            }},
        }),
    ],
    mode_defs=[
        ModeDefinition(
            resource_defs={'io_manager': fs_io_manager},
            executor_defs=default_executors,
        ),
    ],
)
def complex_pipeline() -> None:
    """Docstring for complex_pipeline."""
    cereals = load_cereals()
    cereal_results = cereals.map(process_cereal)
    display_cereal_results(cereal_results.collect())


# FROM: https://github.com/dagster-io/dagster/blob/0.11.4/examples/docs_snippets/docs_snippets/intro_tutorial/advanced/scheduling/scheduler.py
def weekday_filter(context) -> bool:
    """Returns true if current day is a weekday."""
    return datetime.today().weekday() < 5


@daily_schedule(
    pipeline_name='complex_pipeline',
    start_date=datetime(2021, 1, 1),
    execution_time=time(10, 5),
    execution_timezone='US/Central',
    should_execute=weekday_filter,
)
def good_weekday_morning_schedule(date):
    return {
        'solids': {
            'load_cereals': {
                'inputs': {'date': {'value': date.strftime('%Y_%m_%d')}},
            },
        },
    }


# Just a collection
@repository
def complex_repository():
    return [complex_pipeline, good_weekday_morning_schedule]


# --------------------------------------------------------------------------------------


# https://docs.dagster.io/_apidocs/execution#dagster.execute_solid
def test_get_most_calories():
    cereals = [{'calories': '1', 'name': 'one'}, {'calories': '2', 'name': 'two'}]

    result = execute_solid(get_most_calories, input_values={'cereals': cereals})

    # https://docs.dagster.io/_apidocs/execution#dagster.SolidExecutionResult
    assert result.success
    assert result.output_value('result') == 'two', result.output_values


def test_complex_pipeline():
    # Can also be a yaml file passed to CLI with "-c" for test vs. production
    # https://docs.dagster.io/tutorial/intro-tutorial/configuring-solids
    run_config = {
        'solids': {'load_cereals': {'config': {'max_cereal': 2}}},
        # WARN: Only run multiprocessing through dagit
        # 'execution': {'multiprocess': {'config': {
        #     'max_concurrent': 10,
        # }}},
    }

    result = execute_pipeline(complex_pipeline, run_config=run_config)

    assert result.success
    assert len(result.solid_result_list) > 2
    for solid_res in result.solid_result_list:
        assert solid_res.success


if __name__ == '__main__':
    # test_get_most_calories()
    test_complex_pipeline()

    result = execute_pipeline(complex_pipeline, preset='local')
