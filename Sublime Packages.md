# Sublime Tips:
- Time tracking with: http://www.codeivate.com/users/kyleking
- [Git package](https://github.com/kemayo/sublime-text-git/wiki) is useful for command-line git, but I only use UI
- [JsFormat](https://sublime.wbond.net/packages/JsFormat) Do I use it?
- You can look up the word under the cursor or selected text in Dash using ctrl+h
- [Prettify JSON](https://github.com/dzhibas/SublimePrettyJson)
- SCSS expander tells you what the hierarchy of a SCSS element is
- Create ToC in Markdown with Markdown​TOC or preview with Markdown​ Preview

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

Old styles:
{
    "color_scheme": "Packages/User/base16-ocean.dark (SL).tmTheme",
    "draw_white_space": "all",
    "font_face": "Input Sans Condensed",
    "font_size": 15,
    "ignored_packages":
    [
        "Vintage",
        "SublimeCodeIntel",
        "Markdown",
        "LaTeXTools"
    ],
    "rulers":
    [
        80
    ],
    "spacegray_sidebar_font_normal": true,
    "spacegray_sidebar_tree_normal": true,
    "spacegray_tabs_auto_width": true,
    "spacegray_tabs_font_normal": true,
    "spacegray_tabs_large": true,
    "tab_size": 2,
    "theme": "Spacegray.sublime-theme",
    "translate_tabs_to_spaces": true
}

## Sublime Packages:

#### SublimeLiner-Annotations:
This linter plugin for SublimeLinter highlights annotations in comments such as FIXME, NOTE, TODO, @todo, XXX, and README.
Link: https://packagecontrol.io/packages/SublimeLinter-annotations

#### SublimeLinter-jsdebugmarkers
Highlights console.log/error/warn in code

#### Terminal
Open current working directory in a new iTerm window. Overwrote shortcut keys as:
(CMD)super+shift+alt+o 		open_terminal (open parent folder of file)
(CMD)super+shift+o 				open_terminal_project_folder (opens project folder)
Link: https://packagecontrol.io/packages/Terminal

#### Glue
Great for running single commands, but can not act interactively right now for tasks such as SSH or Meteor.
Link: http://sweetme.at/2014/04/07/glue-a-terminal-for-sublime-text/

#### Theme of Choice: Material Theme
(Material-Theme-OceanicNext (SL))
Link: https://github.com/equinusocio/material-theme

#### Dash Doc
Great for JS, but had to override default settings for coffee script to be none.
"keys": ["super+`"], "command": "dash_doc"
Link: ...


#### Themr
#### ColorSublime
#### table editor (markdown)
#### annotations
#### stylus snippets
#### sidebar folders
#### print to html
#### js snippets
#### jade snippets
#### githubinator
#### github flavored markdown preview
#### eval printer
#### docblockr
#### bootstrap 3 jade snip
#### better coffeescript
#### anaconda
#### all autocomplate
#### alignment
#### advanced csv
#### 1 self


## Sublime Notes
- Useful to set .m files as MATLAB: http://stackoverflow.com/a/8014142/3219667
- Show Console: ctrl + ` (not the ')
- Show sidebar/folders: cmd+k then cmd+b
- Goto Anything:
-	Would often index files that I'm not interested in (i.e. compiled JS or core .* files) ->
	Link: http://stackoverflow.com/questions/13706965/limit-file-search-scope-in-sublime-text-2
	Added to Sublime Settings
		"binary_file_patterns": ["*.jpg", "*.jpeg", "*.png", "*.gif", "*.ttf", "*.tga", "*.dds", "*.ico", "*.eot", "*.pdf", "*.swf", "*.jar", "*.zip"],
		"folder_exclude_patterns": [".git", ".meteor/local", "node_modules"]
	Per project basis: https://css-tricks.com/exclude-compiled-css-from-sublime-text-2-projects/