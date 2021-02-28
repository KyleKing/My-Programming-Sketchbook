"""Update a SQLite database in real time. Requires Grafana and Python >3.6.

```
python -m pip install numpy tqdm
python create_grafana_sample_db.py
```

See discussion context: https://github.com/fr-ser/grafana-sqlite-datasource/issues/21

"""

import sqlite3
import time
from contextlib import ContextDecorator
from pathlib import Path

import numpy as np
from tqdm import tqdm


class SQLConnection(ContextDecorator):
    """Ensure the SQLite connection is properly opened and closed."""

    def __init__(self, path_db: Path) -> None:
        """Initialize context wrapper.

        Args:
            path_db: Path to a SQLite file

        """
        self.conn = None
        self.path_db = path_db

    def __enter__(self) -> sqlite3.Connection:
        """Connect to the database and return connection reference.

        Returns:
            Connection: connection to sqlite database

        """
        self.conn = sqlite3.connect(self.path_db)
        return self.conn

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        """Close connection."""  # noqa: DAR101
        self.conn.close()


def generate_fake_db(path_db: Path) -> None:
    """Populate a SQL database in real time to test real time chart visualization.

    Args:
        path_db: path to SQLite file

    """
    print(f'Creating: {path_db}')  # noqa: T001
    with SQLConnection(path_db) as conn:
        cursor = conn.cursor()
        cursor.execute('DROP TABLE IF EXISTS test_data;')
        conn.commit()

        cursor.execute("""CREATE TABLE test_data (
            time    FLOAT    NOT NULL,
            temp    FLOAT    NOT NULL,
            min     FLOAT    NOT NULL,
            max     FLOAT    NOT NULL
        );""")
        conn.commit()

        while True:
            # Generate random data points and add to the database
            points = 1000
            mu, sigma = (10, 8)  # mean and standard deviation
            samples = np.random.normal(mu, sigma, points)
            for idx in tqdm(range(points)):
                values = f'{time.time()}, {samples[idx]}, {samples[idx] - 2.1}, {samples[idx] + 3.2}'
                cursor.execute(f'INSERT INTO test_data (time, temp, min, max) VALUES ({values});')  # noqa: S608, Q440
                conn.commit()
                time.sleep(1)


if __name__ == '__main__':
    generate_fake_db(path_db=Path(__file__).resolve().parent / 'test_db.sqlite')
