# sauna

CLI tool to show available updates for npm package, sorted and colored by type.
First come the patch updates, then the minor updated, and last come the major
updates (according to Sem.Ver. conventions).

# Getting started

1. Clone the repo
1. Install dependencies:
   ```bash
   npm install
   ```
1. Build the project:
   ```bash
   npm run build
   ```
1. You should have a `sauna` command available on your console. Run it from the
   Node.Js app that you want to check for updates.

# Colors

blue = patch updates

yellow = minor updates

red = major updates

# Version sorting

When sorting the updates available, `sauna` only looks at the current and the
latest version. Since I always use `npm` with `save-exact=true`, the `wanted`
version cannot be used.
