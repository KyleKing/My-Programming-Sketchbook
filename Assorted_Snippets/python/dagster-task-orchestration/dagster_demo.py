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
from operator import itemgetter
from typing import Dict, List, Optional

from dagster import execute_pipeline, pipeline, solid
from dagster.core.execution.context.compute import SolidExecutionContext


@solid
def load_cereals(context: Optional[SolidExecutionContext]) -> List[Dict[str, str]]:
    """Docstring for load_cereals.

    Args:
        context: SolidExecutionContext

    Results:
        str: some string

    """
    dataset_path = os.path.join(os.path.dirname(__file__), 'cereal.csv')
    with open(dataset_path, 'r') as fd:
        return [*csv.DictReader(fd)]


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


@pipeline
def complex_pipeline() -> None:
    """Docstring for complex_pipeline."""
    cereals = load_cereals()
    most_calories = get_most_calories(cereals)
    most_protein = get_most_protein(cereals)
    log_results(most_calories=most_calories, most_protein=most_protein)


def test_complex_pipeline():
    res = execute_pipeline(complex_pipeline)
    assert res.success
    assert len(res.solid_result_list) == 4
    for solid_res in res.solid_result_list:
        assert solid_res.success


def test_get_most_calories():
    result = get_most_calories([{'calories': 1, 'name': 'one'}, {'calories': 2, 'name': 'two'}])

    assert result == 'two'


if __name__ == '__main__':
    test_complex_pipeline()
    result = execute_pipeline(complex_pipeline)
