# sauna

CLI tool to show available updates for an `npm` project, sorted and colored by
type. First the patch updates are shown, then the minor updates, and then the
major updates.

# Install

```bash
npm i -g @nikensss/sauna
```

This will enable the `sauna` command on your terminal.

# Options

## `-p`, `--path`

The `path` to run on:

```bash
sauna -p "~/repos/sauna"
sauna --path "~/repos/sauna"
```

If not specified, the current directory will be used.

## `-i`, `--ignore`

The packages with updates that should be excluded from the update commands.
These will still be visible in the list of available updates, but will not be
added to the update commands.

```bash
sauna -i axios @types/node
sauna --ignore axios @types/node
```

## `--debug`

If this flag is provided, a log file will be created called `sauna.log` at the
location where the command is run with execution details. Useful to debug
issues.

# Colors

blue = patch updates

yellow = minor updates

red = major updates

# Version sorting

When sorting the updates available, `sauna` only looks at the current and the
latest version. Since I always use `npm` with `save-exact=true`, the `wanted`
version cannot be used.
