# sauna

CLI tool to show available updates for an npm project, sorted and colored by
type. First come the patch updates, then the minor updates, and last come the
major updates.

# Getting started

1. Clone the repo
1. Install dependencies:
   ```bash
   npm ci
   ```
1. Build the project:
   ```bash
   npm run build
   ```
1. You should have a `sauna` command available. Run it from the Node.Js app that
   you want to check for updates.

# Options

## `-p`, `--path`

The `path` to run in:

```bash
sauna -p "~/repos/sauna"
sauna --path "~/repos/sauna"
```

If not specified, the current dirctory will be used.

## `-i`, `--ignore`

The packages with updates that should be excluded from the update commands.
These will still be visible in the list of available updates, but will not be
added to the update commands.

```bash
sauna -i axios @types/node
sauna -ignore axios @types/node
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
