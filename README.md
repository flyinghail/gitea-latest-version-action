# Gitea Latest Version
Get the latest version from the tags.

**only use for Gitea action**

## Inputs

### `gitea-token`
**Required** The Gitea token.

### `prefix`
Prefix in front of version tag. Default `"v"`.
Example Prefix `"v"` -> Version `"v0.1.0"`

### `fallback`
Fallback version if no tags are found. Default `"0.0.0"`.

## Outputs

### `major-version`

The major version. Example: `v1.2.3` -> `1`

### `minor-version`

The minor version. Example: `v1.2.3` -> `1.2`

### `patch-version`

The patch version. Example: `v1.2.3` -> `1.2.3`

### `major-number`

The major number. Example: `v1.2.3` -> `1`

### `minor-number`

The minor number. Example: `v1.2.3` -> `2`

### `patch-number`

The patch number. Example: `v1.2.3` -> `3`

## Example usage

```yml
- uses: flyinghail/gitea-latest-version-actiong@v1.0.0
  id: version
  with:
      gitea-token: ${{secrets.GITHUB_TOKEN}}
      fallback: 0.0.0
```
