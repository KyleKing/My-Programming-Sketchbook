# encoding: utf-8

# Huge thanks to the amazing guide:
# http://www.deanishe.net/alfred-workflow/tutorial_1.html#creating-a-new-workflow

import sys
import subprocess
import json
from workflow import Workflow


def get_func_list():
    # Capture STDOUT, source: http://stackoverflow.com/a/4760517/3219667
    p = subprocess.Popen(["/usr/local/bin/hs", "-c", "AlfredFunctions()"],
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE)
    STDOUT, err = p.communicate()
    if err:
        print err
    json_stdout = json.loads(STDOUT)
    # print(json_stdout['wrapper'][1]['FuncName'])
    return json_stdout['wrapper']


def search_key(func):
    # Search multiple values of function
    elements = []
    elements.append(func['func_name'])
    elements.append(func['description'])
    return u' '.join(elements)


def main(wf):
    # Get query from Alfred
    if len(wf.args):
        query = wf.args[0]
    else:
        query = None

    funcs = wf.cached_data('funcs', get_func_list, max_age=1)

    # If script was passed a query, use it to filter posts
    if query:
        funcs = wf.filter(query, funcs, key=search_key, min_score=20)

    # Loop through the returned funcs and add an item for each to
    # the list of results for Alfred
    for func in funcs:
        wf.add_item(title=func['func_name'],
                    subtitle=func['description'],
                    arg=func['func_name']+'()',
                    valid=True,
                    icon=func['icon'])

    # Send the results to Alfred as XML
    wf.send_feedback()


if __name__ == u"__main__":
    wf = Workflow()
    sys.exit(wf.run(main))
