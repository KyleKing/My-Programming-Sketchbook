import sys


def send(info):
    """Standard action to inform Node application of printed info"""
    print info.strip()
    sys.stdout.flush()
