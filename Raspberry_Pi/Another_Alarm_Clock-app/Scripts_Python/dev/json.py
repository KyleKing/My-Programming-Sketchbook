import json
from pprint import pprint

with open('../settings.json') as settings:
    data = json.load(settings)

pprint(data)

print("")
print("data['wiring']['Hot'] = " + data["wiring"]["Hot"])
print("")

# Read Thermocouple Code Example:
which = data["wiring"]["Hot"]

DO_hot = int(data["wiring"][which]["DO"])
CS_hot = int(data["wiring"][which]["CS"])
CLK_hot = int(data["wiring"][which]["CLK"])

print(DO_hot)
print(CS_hot)
print(CLK_hot)
