import sys
import ConfigParser


def send(info):
    """Standard action to inform Node application of printed info"""
    print info.strip()
    sys.stdout.flush()


def get_ini(component, param, file="./py_scripts/settings.ini"):
    """Get pin numbering value from a shared ini file"""
    ini_contents = ConfigParser.RawConfigParser()
    try:
        ini_contents.read(file)
        raw_val = ini_contents.get(component, param)
        return raw_val
    except:
        raise Exception("Failed to load " + file)


def write_ini(component, param, value, file="./py_scripts/settings.ini"):
    settings_config = ConfigParser.RawConfigParser()
    settings_config.read(file)
    with open(file, 'w') as cfgfile:
        settings_config.set(component, param, value)
        settings_config.write(cfgfile)
