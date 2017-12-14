# -*- coding: utf-8 -*-

import re
import operator
import alfred
import calendar
from datetime import datetime
from delorean import utcnow, parse, epoch


def process(query_str):
    """ Entry point """
    value = parse_query_value(query_str)

    if value is not None:
        results = alfred_items_for_value(value)
        xml = alfred.xml(results)  # compiles the XML answer
        alfred.write(xml)  # writes the XML back to Alfred


def parse_query_value(query_str):
    """ Return value for the query string """
    try:
        query_str = str(query_str).strip('"\' ')
        # [mhdwMy] min, hour, day, week, Month, year
        # Fixed logical order and regexp
        match = re.match('(\+|\-)(\d+)(\S)', query_str)
        if match is None:
            if query_str == 'now':
                d = utcnow()
            else:
                # Parse datetime string or timestamp
                try:
                    if query_str.isdigit() and len(query_str) == 13:
                        query_str = query_str[:10] + '.' + query_str[10:]
                    d = epoch(float(query_str))
                except ValueError:
                    d = parse(str(query_str))
        else:
            d = shift_time(match.group(1), match.group(2), match.group(3))
    except (TypeError, ValueError):
        d = None
    return d


def shift_time(op, value, measure):
    # Create operator map, to avoid some if/else's
    op_map = {'+': operator.add, '-': operator.sub}
    multiplier = 1

    if measure == 'm':
        multiplier = 60
    elif measure == 'h':
        multiplier = 60 * 60
    elif measure == 'd':
        multiplier = (60 * 60) * 24
    elif measure == 'w':
        multiplier = ((60 * 60) * 24) * 7
    elif measure == 'M':
        multiplier = ((60 * 60) * 24) * 30  # egh.. FIXME
    elif measure == 'y':
        multiplier = ((60 * 60) * 24) * 365

    # Convert our value measure to seconds
    seconds = multiplier * int(value)
    current_ts = calendar.timegm(datetime.now().timetuple())

    return epoch(op_map[op](current_ts, seconds))


def alfred_items_for_value(value):
    """
    Given a delorean datetime object, return a list of
    alfred items for each of the results
    """

    index = 0
    results = []

    # First item as timestamp
    item_value = calendar.timegm(value.datetime.utctimetuple())
    results.append(alfred.Item(
        title=str(item_value),
        subtitle=u'UTC Timestamp',
        attributes={
            'uid': alfred.uid(index),
            'arg': item_value,
        },
        icon='icon.png',
    ))
    index += 1

    # Various formats
    formats = [
        # 1937-01-01 12:00:27
        ("%Y-%m-%d %H:%M:%S", ''),
        # 19 May 2002 15:21:36
        ("%d %b %Y %H:%M:%S", ''),
        # Sun, 19 May 2002 15:21:36
        ("%a, %d %b %Y %H:%M:%S", ''),
        # 1937-01-01T12:00:27
        ("%Y-%m-%dT%H:%M:%S", ''),
        # 1996-12-19T16:39:57-0800
        ("%Y-%m-%dT%H:%M:%S%z", ''),
    ]
    for format, description in formats:
        item_value = value.datetime.strftime(format)
        results.append(alfred.Item(
            title=str(item_value),
            subtitle=description,
            attributes={
                'uid': alfred.uid(index),
                'arg': item_value,
            },
            icon='icon.png',
        ))
        index += 1

    return results


if __name__ == "__main__":
    try:
        query_str = alfred.args()[0]
    except IndexError:
        query_str = None
    process(query_str)
