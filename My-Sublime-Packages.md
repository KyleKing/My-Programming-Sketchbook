# Sublime Tips:

## TO ADD
sublime-enhanced and AutocompletionFuzzy (https://github.com/shagabutdinov/sublime-enhanced)

## Best Themes:
> Edit with Themr Package

Spacegray (below) - classic, with minimized tabs (or .light)
Centurion - galea + green folders, small tabs
Numix - minimal linting, big orange tabs
Orchis Dark - use with solarized, sweet purple tabs
itg.flat.dark/light - big tabs and lots of flat color
predawn - istracting sidebar, bug tabs, use with soda - monokai

## Best Schemes:
> Edit with Schemr Package

3024_Day
Afterglow
Galea
Bittersweet
Iceberg
and see favorites

## Sublime Packages:

#### Advanced CSV

Key bindings

- Ctrl+Comma, Up  Sort by column (Ascending)
- Ctrl+Comma, Down    Sort by column (Descending)
- Ctrl+Comma, i   Insert column
- Ctrl+Comma, d   Delete column
- Ctrl+Comma, s   Select column
- Ctrl+Comma, Space   Justify columns
- Ctrl+Comma, Comma   Collapse columns
- Ctrl+Comma, Equals  Evaluate cells

### [JsFormat](https://sublime.wbond.net/packages/JsFormat)
For quickly formating JSON

### [SublimeLiner-Annotations](https://packagecontrol.io/packages/SublimeLinter-annotations)
This linter plugin for SublimeLinter highlights annotations in comments such as FIXME, NOTE, TODO, @todo, XXX, and README.

### SublimeLinter-jsdebugmarkers
Highlights console.log/error/warn in code

### Other Sublime Linter
stylint, sass, puglint, mlint, mdl, lua, json, jslint, jscs, eslint, coffeelint, annotations

### [Terminal](https://packagecontrol.io/packages/Terminal)
Open current working directory in a new iTerm window. Overwrote shortcut keys as:
```json
[
    { "keys": ["super+shift+alt+o"], "command": "open_terminal" },
    { "keys": ["super+shift+o"], "command": "open_terminal_project_folder" }
]
```

### [DocBlockr](https://packagecontrol.io/packages/DocBlockr)
simplifies added block comments (start a comment before a function, etc.)

- Pressing enter or tab after /** (or ###* for Coffee-Script) yields a new line and closes the comment.
- However, if the line directly afterwards contains a function definition, then its name and parameters are parsed and some documentation is automatically added. Press Tab to move forward through the fields, press Shift+Tab to move back through the fields.
- If the line following the docblock contains a variable declaration, DocBlockr will try to determine the data type of the variable and insert that into the comment. Press space or shift+enter after an opening /** to insert an inline docblock.
- If you write a double-slash comment and then press Ctrl+Enter, DocBlockr will 'decorate' that line for you.

### [Theme of Choice: Material Theme](https://github.com/equinusocio/material-theme)
And the AppBar extension for a hug green tab bar (Material Theme AppBar)
```json
{
    "color_scheme": "Packages/User/SublimeLinter/Material-Theme-OceanicNext (SL).tmTheme",
    "theme": "Material-Theme.sublime-theme"
}
```
Note: Make sure there isn't a second JSON property for theme or this theme will be overwritten

### AutocompletionFuzzy (Part of bigger package - see above)
Provides 8 different types of autocompletion:

1. Complete word - basic completion; completes word that occurenced in text and opened files.
1. Complete word (fuzzy) - like “complete word” but uses fuzzy match over words.
1. Complete subword - completes snake_case and CamelCase words parts.
1. Complete long word - complete long words: class names with namespaces (Class::Name), method calls (object.method), filenames (file/name.py), urls (http://…).
1. Complete long word (fuzzy) - line “complete long word” but uses fuzzy match over words.
1. Complete nesting - completes over and into brackets: can complete full method call (method(arg1, arg2)), method arguments (arg1, arg2), array ([value1, value2]) and everything that has brackets over it or after it.
1. Complete nesting (fuzzy) - like “complete nesting” but uses fuzzy match.
1. Complete line - competes whole line.
1. However it maps only 6 types of autocompletion. Not fuzzy completions aren't mapped to keyboard shortcuts by default. See “installation” section if you would like map non-fuzzy completion behavior.
1. All lists are build in order of first occurence of word. That makes autocomplete very predictable and easy to use.
1. Words completion works over all files opened. Nesting completion works only in current file (because of performance issues)

### Others
- Better Coffeescript
- Color Highlighter
- Color Sublime
- LESS
- Side Bar Enhancements - a complete necessity
- Stylus
- Stylus Snippets (not included in the stylus package)
- Trailing Spaces - super simple and wonderful
- Anaconda - for everything Python
- Babel - for React/ES6 (Nylas/N1 work)
- SublimeCodeIntel - learn snippets
- SublimeLinter - for everything
- Stino - Arduino Like IDE
- Alignment - Shift + Command + A to auto-align (?)
- Themr
- Markdown Light - nice dark/light color schemes and syntax highlighting
- Git​Gutter - see git status
- **Print to HTML** - Shift + alt + P -> opens up file with syntax highlighting and line numbers in browser
- All Autocomplete - extends Sublime autocomplete to all files in folders

### Possibly in use/maybe not:

#### (?) Dash Doc
You can look up the word under the cursor or selected text in Dash using ctrl+h

Great for JS, but had to override default settings for coffee script to be none.
"keys": ["super+`"], "command": "dash_doc"

#### (?) Glue
Great for running single commands, but can not act interactively right now for tasks such as SSH or Meteor.
Link: http://sweetme.at/2014/04/07/glue-a-terminal-for-sublime-text/

#### Previously Ignored:
- Advanced CSV
- Alignment
- Bootstrap 3 Jade Snippets
- Focus File on Sidebar
- Glue
- SublimeLinter-jsdebugmarkers

#### Other Packages left unused

- [Prettify JSON](https://github.com/dzhibas/SublimePrettyJson)
- 1 self or time tracking with: http://www.codeivate.com/users/kyleking
- Eval​Printer - live test python/JS
- Markdown​TOC - not found?
- sidebar folders - An alternative to Sublime projects
- [Git package](https://github.com/kemayo/sublime-text-git/wiki) is useful for command-line git, but I only use UI
- SCSS expander tells you what the hierarchy of a SCSS element is

## Sublime Notes
- Useful to set .m files as MATLAB: http://stackoverflow.com/a/8014142/3219667
- Show Console: ctrl + ` (not the ')
- Show sidebar/folders: cmd+k, then cmd+b
- Goto Anything:
-	Would often index files that I'm not interested in (i.e. compiled JS or core .* files) ->
	Link: http://stackoverflow.com/questions/13706965/limit-file-search-scope-in-sublime-text-2
	Added to Sublime Settings
		"binary_file_patterns": ["*.jpg", "*.jpeg", "*.png", "*.gif", "*.ttf", "*.tga", "*.dds", "*.ico", "*.eot", "*.pdf", "*.swf", "*.jar", "*.zip"],
		"folder_exclude_patterns": [".git", ".meteor/local", "node_modules"]
	Per project basis: https://css-tricks.com/exclude-compiled-css-from-sublime-text-2-projects/

## Config File:
```json
{
    "added_words":
    [
        "immiscible",
        "mixin",
        "polyline"
    ],
    "binary_file_patterns":
    [
        "*.jpg",
        "*.jpeg",
        "*.png",
        "*.gif",
        "*.ttf",
        "*.tga",
        "*.dds",
        "*.ico",
        "*.eot",
        "*.pdf",
        "*.swf",
        "*.jar",
        "*.zip"
    ],
    "bold_folder_labels": true,
    "caret_style": "wide",
    "color_scheme": "Packages/User/SublimeLinter/Material-Theme-OceanicNext (SL).tmTheme",
    "draw_minimap_border": true,
    "enable_telemetry": false,
    "fade_fold_buttons": false,
    "folder_exclude_patterns":
    [
        ".git",
        ".meteor/local",
        "node_modules"
    ],
    "font_face": "Hack",
    "font_options":
    [
        "subpixel_antialias"
    ],
    "font_size": 12,
    "highlight_line": true,
    "highlight_modified_tabs": true,
    "ignored_packages":
    [
        "Advanced CSV",
        "Alignment",
        "Bootstrap 3 Jade Snippets",
        "Focus File on Sidebar",
        "Glue",
        "Markdown",
        "SublimeLinter-jsdebugmarkers",
        "Vintage"
    ],
    "ignored_words":
    [
        "5V",
        "Agarose",
        "Arduino",
        "Bitzer",
        "Hammerspoon",
        "unsubscribe",
        "unsubscription",
        "unsubscriptions"
    ],
    "indent_guide_options":
    [
        "draw_normal",
        "draw_active"
    ],
    "line_padding_bottom": 1,
    "line_padding_top": 1,
    "material_theme_contrast_mode": true,
    "preview_on_click": true,
    "rulers":
    [
        80,
        120
    ],
    "scroll_past_end": true,
    "shift_tab_unindent": true,
    "show_panel_on_build": true,
    "spell_check": true,
    "tab_completion": true,
    "tab_size": 2,
    "theme": "Material-Theme.sublime-theme",
    "translate_spaces_to_tabs": true,
    "trim_trailing_white_space_on_save": true,
    "word_wrap": true
}
```