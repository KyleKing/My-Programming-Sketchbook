import pandas as pd
from pathlib import Path
import matplotlib.pyplot as plt
from loguru import logger
import pendulum

mtimes = []
PRIV_DIR = Path("/private/var/folders/1f/gd24l7210d3d8crp0clcm4440000gn/T")
for img in PRIV_DIR.glob("*-lockscreen.png"):
    mtimes.append(img.stat().st_mtime)

logger.info(mtimes[0])
logger.info(pendulum.from_timestamp(mtimes[0]))

mtimes = [*map(pendulum.from_timestamp, mtimes)]
df = pd.DataFrame(mtimes, columns=["timestamps"])
# df["timestamps"] = pd.to_datetime(df["timestamps"], units="s") <- Not work?
df.set_index("timestamps", inplace=True)
df.resample("1H").size().plot.bar()
plt.show()

breakpoint()
