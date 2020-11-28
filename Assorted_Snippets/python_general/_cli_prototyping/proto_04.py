"""Experimenting with cmd2 modular command sets."""

import argparse

from cmd2 import Cmd, Cmd2ArgumentParser, CommandSet, Statement, with_argparser, with_category, with_default_category


@with_default_category('Fruits')
class LoadableFruits(CommandSet):
    def __init__(self):
        super().__init__()

    def do_apple(self, _: Statement):
        self._cmd.poutput('Apple')

    def do_banana(self, _: Statement):
        self._cmd.poutput('Banana')


@with_default_category('Vegetables')
class LoadableVegetables(CommandSet):
    def __init__(self):
        super().__init__()

    def do_arugula(self, _: Statement):
        self._cmd.poutput('Arugula')

    def do_bokchoy(self, _: Statement):
        self._cmd.poutput('Bok Choy')


class ExampleApp(Cmd):
    """
    CommandSets are loaded via the `load` and `unload` commands
    """

    def __init__(self, *args, **kwargs):
        # gotta have this or neither the plugin or cmd2 will initialize
        super().__init__(*args, auto_load_commands=False, **kwargs)

        self._fruits = LoadableFruits()
        self._vegetables = LoadableVegetables()

    load_parser = Cmd2ArgumentParser()
    load_parser.add_argument('cmds', choices=['fruits', 'vegetables'])

    @with_argparser(load_parser)
    @with_category('Command Loading')
    def do_load(self, ns: argparse.Namespace):
        if ns.cmds == 'fruits':
            try:
                self.register_command_set(self._fruits)
                self.poutput('Fruits loaded')
            except ValueError:
                self.poutput('Fruits already loaded')

        if ns.cmds == 'vegetables':
            try:
                self.register_command_set(self._vegetables)
                self.poutput('Vegetables loaded')
            except ValueError:
                self.poutput('Vegetables already loaded')

    @with_argparser(load_parser)
    def do_unload(self, ns: argparse.Namespace):
        if ns.cmds == 'fruits':
            self.unregister_command_set(self._fruits)
            self.poutput('Fruits unloaded')

        if ns.cmds == 'vegetables':
            self.unregister_command_set(self._vegetables)
            self.poutput('Vegetables unloaded')


if __name__ == '__main__':
    app = ExampleApp()
    app.cmdloop()
