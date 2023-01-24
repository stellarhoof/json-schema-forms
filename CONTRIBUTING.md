# Contributor guide

#### Running commands

Commands can be run from the root or scoped to specific directories/workspaces

```bash
# From the root:
# > yarn {cmd} [dir]
# Ex:
yarn vitest
yarn vitest packages/client

# From inside package directory
# > cd packages/{dir} && yarn run -T {cmd}
# Ex:
cd packages/tree-utils && yarn run -T vitest

# From any directory, specifying workspace
# > yarn workspace {workspace} run -T {cmd}
# Ex:
yarn workspace @json-schema-form/tree-utils run -T vitest .
```
