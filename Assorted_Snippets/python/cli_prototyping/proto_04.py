"""Experimenting with cmd2 modular command sets."""

import argparse
from functools import partial
from typing import List

from cmd2 import Cmd, Cmd2ArgumentParser, CommandSet, Statement, with_argparser, with_category, with_default_category
from cmd2.table_creator import BorderedTable, Column


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
    """CommandSets are loaded via the `load` and `unload` commands."""

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


# ======================================================================================================
# PLANNED: This is just a cool looking table output that may be useful
def create_cmd_table(table_data: List[List[str]], width: int = 15) -> BorderedTable:
    """Create a bordered table for cmd2 output.

    Args:
        table_data: list of lists with the string data to display
        width: integer width of the columns. Default is 15 which generally works for ~4 columns

    Returns:
        BorderedTable: generated table for printing

    """
    columns = table_data[0]
    auto_column = partial(Column, width=width)
    bt = BorderedTable([*map(auto_column, columns)])
    rows = table_data[1:]
    return bt.generate_table(rows)


class ExtendedDisplay:  # noqa: H601
    """Extended Display Command Set with New Commands for More Interactive Output."""

    def do_display_table(self, statement: Statement) -> None:
        """Display a Table of (TBD) Data.

        Args:
            statement: results of parsing

        """
        # Placeholder sample data
        _table_data = [
            ['Studio', '# Movies', '# PPV', 'Revenue'],
            ['Netflix', '12', '14', f'{999999:,}'],
            ['Amazon Prime Video', '12', '14', f'{21450:,}'],
        ]
        self._cmd.poutput(create_cmd_table(_table_data))


if __name__ == '__main__':
    app = ExampleApp()
    app.cmdloop()
