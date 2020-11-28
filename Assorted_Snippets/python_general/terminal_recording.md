# Terminal Recording

For whatever reason, these snippets reaaaally slow down VSCode, so here they are in a separate file!

## asciinema ([docs](https://github.com/asciinema/asciinema))

Recording a terminal session

```sh
poetry add asciinema -D

poetry run asciinema rec -i 2 first.cast

poetry run asciinema play -s 2 first.cast
# Or play at normal speed, but with a limit on idle time (1s) - not 2s was applied in the recording above!
poetry run asciinema play -i 1 first.cast

# You can write to a file from a recorded cast
poetry run asciinema cat first.cast >> first.txt

poetry run asciinema upload first.cast
poetry run asciinema auth
```

## svg-term-cl

Creating SVGs that can be shown in Github

```sh
npm install svg-term-cli

# Create a cast from above asciinema instructions ("first.cast")
npx svg-term --in first.cast --out first.svg
```

Note, using npx instead of `PATH=$(npm bin):$PATH` from: https://stackoverflow.com/a/15157360/3219667

You can't modify the speed in svg-term, but as a workaround, you can **re-record** the cast ([Source](https://github.com/marionebl/svg-term-cli/issues/36?_pjax=%23js-repo-pjax-container#issuecomment-629854085)):

```sh
asciinema rec second.cast -c "asciinema play first.cast --speed 2"
# And thereafter, use svg-term to compile
svg-term --in second.cast --out second.svg
```

You may also need custom fonts (see [svgembed](https://github.com/miraclx/svgembed)), but this didn't work for me:

```sh
npm i git+https://github.com/miraclx/svgembed
npx svgembed -i first.svg -o first-font.svg --overwrite -f MesloLGS_NF_Regular.ttf
```
