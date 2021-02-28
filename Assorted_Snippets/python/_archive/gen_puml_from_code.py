"""Use regular expressions to scrape arbitrary code for features relevant to PlantUML.

NOTE: Created as a proof of concept for CS-6310 to capture the high-level code structure in PlantUML

"""

import re
from pathlib import Path
from pprint import pprint
from typing import List, Pattern

from transitions import Machine


def scrape_file(path_code: Path, re_feature: Pattern[str]) -> List[str]:
    """Scrape a file using a compiled regular expression returning the list of results."""  # noqa: DAR101,DAR201
    # Note: Doesn't handle multiple lines. Would probably be better to use an AST if that complexity is needed
    code = path_code.read_text()
    features = []
    for match in re_feature.finditer(code, re.MULTILINE):
        features.append(match.group(1))
    return features


def format_lines_puml(features: List[str]) -> List[str]:
    """Format a list of features into the puml string representation."""  # noqa: DAR101,DAR201
    # Note: Replaced with transitions state machine below
    lines_puml = []
    in_class = False
    last_feature = features[0]
    for next_feature in features[1:]:
        is_indented = next_feature.startswith(' ')
        if is_indented and in_class:
            lines_puml.extend([last_feature])
        elif is_indented:
            lines_puml.extend([last_feature + ' {'])
            in_class = True
        else:
            lines_puml.extend([last_feature, '}'])
            in_class = False
        last_feature = next_feature
    lines_puml.extend([next_feature])

    if in_class:
        lines_puml.extend(['}'])
    return lines_puml


class PUMLMachine:  # noqa: H601
    """State machine to create PlantUML text."""

    state_normal = 'normal'
    state_in_class = 'in_class'

    states = [state_normal, state_in_class]

    transitions = [
        {'trigger': 'start_class', 'source': state_normal, 'dest': state_in_class},
        {'trigger': 'end_class', 'source': state_in_class, 'dest': state_normal},
    ]

    def __init__(self):
        """Initialize state machine."""
        self.machine = Machine(model=self, states=self.states, initial=self.state_normal, transitions=self.transitions)

    def parse(self, features: List[str]):  # noqa: CCR001
        """Parse lines and insert new_text.

        Args:
            features: list of string features

        Returns:
            list: list of strings for README

        """
        lines_puml = []
        features = [feat.replace('\t', '    ').rstrip() for feat in features]
        next_feature = None
        last_feature = features[0]
        lines_puml.append(last_feature)
        for next_feature in features[1:]:
            next_has_indent = next_feature.startswith(' ')
            if next_has_indent and self.state != self.state_in_class:
                lines_puml[-1] += ' {'
                self.start_class()
            elif not next_has_indent:
                lines_puml.append('}')
                self.end_class()
            lines_puml.append(next_feature)
            last_feature = next_feature

        if next_feature:
            lines_puml.append(next_feature)

        if self.state == self.state_in_class:
            lines_puml.append('}')
            self.end_class()

        return [*map(self.format_feature, lines_puml)]

    def format_feature(self, feature: str) -> str:
        """Format a string feature from the source code into PlantUML syntax."""  # noqa: DAR101,DAR201
        # PLANNED: Tokenize the feature into something that is easier to reorder and work with
        for label, key in [('private', '-'), ('public', '+')]:
            feature = feature.replace(label, key)
        return feature


# Note: need to modify for language-specific modifications for code cleanup, like flipping variables names, etc.
class CSharpPUMLMachine(PUMLMachine):  # noqa: H601
    """C# Variant of the PlantUML Machine."""

    def format_feature(self, feature: str) -> str:
        """Format a string feature from the source code into PlantUML syntax."""  # noqa: DAR101,DAR201
        feature = super().format_feature(feature)
        # FIXME: implement C# specific logic
        if 'Task<IActionResult>' in feature:
            feature = feature.replace(' Task<IActionResult>', '') + ': Task<IActionResult>'
        feature = feature.replace('+ class', 'class')
        if feature.startswith('class '):
            feature = feature.replace(' : ', ' extends ')

        return feature  # noqa: R504


def write_puml(puml_machine: PUMLMachine, path_puml: Path, paths_code: List[Path],
               re_feature: Pattern[str]) -> None:
    """Scrape the files for relevant features and write to a PUML file."""  # noqa: DAR101,DAR201
    lines_puml = [f'@startuml {type_name(puml_machine)}']
    for path_code in paths_code:
        lines_puml.extend([f"' {path_code}"])
        features = scrape_file(path_code, re_feature)
        lines_puml.extend(puml_machine.parse(features))  # .Alt: format_lines_puml(features)
    lines_puml.extend(['@enduml'])
    path_puml.write_text('\n'.join(lines_puml + ['']))


def type_name(x):
    print('-' * 15)
    print(type(x).__name__)
    print(type(x).__qualname__)
    print(x.__class__.__qualname__)

    import inspect
    members = dict(inspect.getmembers(x, inspect.isbuiltin))
    pprint(members.keys())
    # print(members['__name__'])
    # print(members['__qual_name__'])

    print('-' * 15)
    return type(x).__name__


if __name__ == '__main__':
    re_feature = re.compile(r'\n    ([ ]*(?:public|private) [^\n]+)\n')
    dir_code = Path(__file__).resolve().parents[1] / 'CS6310-Fall20-A6-26-Server'

    # pprint(scrape_file(dir_code / 'StreamingController.cs', re_feature))  # noqa: T003

    # TODO: Specify the document header and footer for custom styles, etc.
    puml_machine = CSharpPUMLMachine()
    path_puml = Path(__file__).parent / '_diagrams' / f'{dir_code.name}.puml'
    paths_code = [*dir_code.rglob('*.cs')]
    write_puml(puml_machine, path_puml, paths_code, re_feature)
    pprint(f'Created: {path_puml}')  # noqa: T003
