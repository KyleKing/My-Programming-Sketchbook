"""Example with Prefect handling errors.

Source: https://docs.prefect.io/core/tutorial/04-handling-failure.html

More Ways to Handle Failures

- Task Triggers: selectively execute Tasks based on the states from upstream Task runs
- State Handlers: provide a Python function that is invoked whenever a Flow or Task changes state - see all the things!
- Notifications: Get Email notifications upon state changes of interest (EmailTask in combination with Task Triggers)

"""

from datetime import timedelta

from prefect import Flow, Parameter, task

import aircraftlib as aclib


@task(max_retries=3, retry_delay=timedelta(seconds=10))
def extract_reference_data():
    print("fetching reference data...")
    return aclib.fetch_reference_data()


@task(max_retries=3, retry_delay=timedelta(seconds=10))
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
    raw_aircraft_data = aclib.fetch_live_aircraft_data(area=area, simulate_failures=2)

    return raw_aircraft_data


@task
def transform(raw_aircraft_data, ref_data):
    print("cleaning & transform aircraft data...")

    live_aircraft_data = []
    for raw_vector in raw_aircraft_data:
        vector = aclib.clean_vector(raw_vector)
        if vector:
            aclib.add_airline_info(vector, ref_data.airlines)
            live_aircraft_data.append(vector)

    return live_aircraft_data


@task
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
    with Flow("etl") as flow:
        airport = Parameter("airport", default="IAD")
        radius = Parameter("radius", default=200)

        reference_data = extract_reference_data()
        live_data = extract_live_data(airport, radius, reference_data)

        transformed_live_data = transform(live_data, reference_data)

        load_reference_data(reference_data)
        load_live_data(transformed_live_data)

    flow.run(airport="DCA", radius=10)


if __name__ == "__main__":
    main()
