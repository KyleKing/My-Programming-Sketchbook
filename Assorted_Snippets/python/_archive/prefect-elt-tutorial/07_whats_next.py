"""Example Next Steps for Prefect.

Source: https://docs.prefect.io/core/tutorial/07-next-steps.html

FYI: Dashboard: https://docs.prefect.io/core/getting_started/installation.html#running-the-local-server-and-ui

```sh
# Run Once
poetry run prefect backend server
```

In separate shells:

```sh
poetry run prefect backend start

# ONly necessary to run jobs from the server
poetry run prefect agent local start

# Register and run a flow to show up in the server
# https://docs.prefect.io/core/getting_started/first-steps.html#orchestrating-flows
poetry run prefect create project "07_whats_next"
poetry run python 07_whats_next.py
```

"""

from datetime import datetime, timedelta

import prefect
from prefect import Flow, Parameter, task
from prefect.engine.results import LocalResult
from prefect.executors import LocalDaskExecutor
from prefect.schedules import IntervalSchedule

import aircraftlib as aclib

# FYI: capture external logs in prefect logs
# prefect.config.logging.extra_loggers = ['custom_lib_name']
# Store name of external loggers. Internally, Prefect call: `logging.getLogger('custom_lib_name')`
# Can also be configured in TOML: https://docs.prefect.io/core/concepts/logging.html#extra-loggers

RESULT = LocalResult(dir="./local-results")
# TODO: this needs some additional work to implement. See links below
# https://docs.prefect.io/core/concepts/results.html
# https://docs.prefect.io/core/concepts/persistence.html


@task(max_retries=3, retry_delay=timedelta(seconds=1))
def extract_reference_data():
    logger = prefect.context.get("logger")
    logger.info("fetching reference data...")
    return aclib.fetch_reference_data()


@task(max_retries=3, retry_delay=timedelta(seconds=1))
def extract_live_data(airport, radius, ref_data):
    # Get the live aircraft vector data around the given airport (or none)
    area = None
    if airport:
        airport_data = ref_data.airports[airport]
        airport_position = aclib.Position(
            lat=float(airport_data["latitude"]), long=float(airport_data["longitude"])
        )
        area = aclib.bounding_box(airport_position, radius)

    print("fetching live aircraft data...")
    raw_aircraft_data = aclib.fetch_live_aircraft_data(area=area)

    return raw_aircraft_data


@task(log_stdout=True)
def transform(raw_aircraft_data, ref_data):
    logger = prefect.context.get("logger")
    logger.info("cleaning & transform aircraft data...")

    live_aircraft_data = []
    for raw_vector in raw_aircraft_data:
        vector = aclib.clean_vector(raw_vector)
        if vector:
            aclib.add_airline_info(vector, ref_data.airlines)
            live_aircraft_data.append(vector)

    return live_aircraft_data


@task(trigger=prefect.triggers.always_run)  # Can set tasks to always run even if they succeeded once
def load_reference_data(ref_data):
    print("saving reference data...")
    db = aclib.Database()
    db.update_reference_data(ref_data)


@task
def load_live_data(live_aircraft_data):
    print("saving live aircraft data...")
    db = aclib.Database()
    db.add_live_aircraft_data(live_aircraft_data)


def main():
    schedule = IntervalSchedule(
        start_date=datetime.utcnow() + timedelta(seconds=1),
        interval=timedelta(minutes=5),
    )

    # PLANNED: Fix why shell tasks fail with exit code 127
    # Should be able to see the command output?
    # [...] INFO - prefect.FlowRunner | Beginning Flow run for 'etl'
    # [...] INFO - prefect.TaskRunner | Task 'ShellTask': Starting task run...
    # [...] ERROR - prefect.ShellTask | Command failed with exit code 127
    # [...] INFO - prefect.TaskRunner | FAIL signal raised: FAIL('Command failed with exit code 127')
    # [...] INFO - prefect.TaskRunner | Task 'ShellTask': Finished task run for task with final state: 'Failed'
    # [...] INFO - prefect.FlowRunner | Flow run FAILED: some reference tasks failed.
    # from prefect.tasks.shell import ShellTask
    # # Docs: https://docs.prefect.io/api/latest/tasks/shell.html
    # shell = ShellTask(shell='zsh', return_all=True, log_stderr=True)
    with Flow("etl", schedule=schedule, result=RESULT) as flow:
        # contents = shell(command='echo "Test?"')
        # logger = prefect.context.get("logger")
        # logger.info(contents)
        #
        # flow.chain(
        #     shell(command='ls'),
        #     # shell(command='poetry --help'),
        #     # shell(command='ls -a'),
        #     # shell(command='dir'),
        # )

        airport = Parameter("airport", default="IAD")
        radius = Parameter("radius", default=200)

        reference_data = extract_reference_data()
        live_data = extract_live_data(airport, radius, reference_data)

        transformed_live_data = transform(live_data, reference_data)

        load_reference_data(reference_data)
        load_live_data(transformed_live_data)

        # flow.visualize()  # FYI: requires "vis" extras and auto-opens PDF reader

    # See notes at top for configuring the task orchestrator UI
    # from pathlib import Path
    # print(flow.register(Path(__file__).stem))  # Causes flow to run forever...
    flow.run(executor=LocalDaskExecutor())


if __name__ == "__main__":
    main()
