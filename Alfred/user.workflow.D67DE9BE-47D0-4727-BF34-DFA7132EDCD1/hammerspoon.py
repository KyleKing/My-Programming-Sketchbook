# encoding: utf-8

# Huge thanks to the amazing guide:
# http://www.deanishe.net/alfred-workflow/tutorial_1.html#creating-a-new-workflow

import sys
from subprocess import Popen, PIPE
# from time import sleep
import json
from workflow import Workflow


def force_HS_reload():
    # Example AppleScript from:
    # http://stackoverflow.com/q/2940916/3219667
    # scpt = '''
    #     on run {x, y}
    #         return x + y
    #     end run'''
    # args = ['2', '2']
    # p = Popen(['osascript', '-'] + args, stdin=PIPE, stdout=PIPE,
    #           stderr=PIPE)
    # STDOUT, err = p.communicate(scpt)
    # # print (p.returncode, STDOUT, err)
    # print STDOUT

    conditional_close = '''
        on run {application_name}
            tell application application_name
                if it is running then
                    quit
                    return "Quit " & application_name
                else
                    return "Already quit " & application_name
                end if
            end tell
            delay 0.4
        end run'''
    conditional_open = '''
        on run {application_name}
            tell application application_name
                if it is running then
                    return application_name & " is already open"
                else
                    launch
                    return "Opened " & application_name
                end if
            end tell
            delay 0.2
        end run'''

    args = ['Hammerspoon']

    p1 = Popen(['osascript', '-'] + args, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    STDOUT, err = p1.communicate(conditional_close)
    p2 = Popen(['osascript', '-'] + args, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    STDOUT, err = p2.communicate(conditional_open)


def get_func_list():
    # Capture STDOUT, source: http://stackoverflow.com/a/4760517/3219667
    p = Popen(["/usr/local/bin/hs", "-c", "AlfredFunctions()"], stdout=PIPE,
              stderr=PIPE)
    STDOUT, err = p.communicate()
    # Try to reload HS config and rerun command
    if err:
        force_HS_reload()
        print err

        # Works if only running a python file, but takes focus from Alfred
        # sleep(2)
        # pTry = Popen(["/usr/local/bin/hs", "-c", "AlfredFunctions()"],
        #              stdout=PIPE, stderr=PIPE)
        # STDOUT, err = pTry.communicate()
        # if err:
        #     print err
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
        input = wf.args[0]
        if " " not in input:
            query = input
            argument = None
        else:
            [query, argument] = input.split(' ', 1)
    else:
        query = None
        argument = None

    funcs = wf.cached_data('funcs', get_func_list, max_age=1)

    # If script was passed a query, use it to filter posts
    if query:
        funcs = wf.filter(query, funcs, key=search_key, min_score=20)

    # Loop through the returned funcs and add an item for each to
    # the list of results for Alfred
    for func in funcs:
        if "arg" not in func:
            func_call = func['func_name']+'()'
        elif argument and func["arg"] == 'string':
            func_call = func['func_name']+"('"+argument+"')"
        elif argument and func["arg"] == 'number':
            func_call = func['func_name']+'('+argument+')'
        else:
            # Maybe support multiple arguments?
            # Split on successive spaces? Or accept a csv list?
            func_call = func['func_name']+'()'
        # arg is a special command that will pass on whatever its contents are
        # to the next command
        wf.add_item(title=func['func_name'],
                    subtitle=func['description'],
                    arg=func_call,
                    valid=True,
                    icon=func['icon'])

    # Send the results to Alfred as XML
    wf.send_feedback()


if __name__ == u"__main__":
    wf = Workflow()
    sys.exit(wf.run(main))
