# chlog

autogenerate a changelog from git metadata

## installation
requires: node, npm
```sh
npm i -g chlog
```

## usage

This is intended to be used as a cli tool to list the github PRs between the
current git HEAD and the last tag (release).

from a git directory:
```sh
$ chlog
```

Generates output that looks like:
```
* [PR #23](https://github.com/jden/foo/pull/23) - Bump to some-dep@1.3.8
* [PR #22](https://github.com/jden/foo/pull/22) - Update documentation to add gifs
```

## super awesome workflow

You can automatically prepend new changes onto the changelog by adding this `preversion` script to your `package.json`:
```json
{
"preversion": "mv changelog.md changelog.old && echo \"## $npm_package_version\" >> changelog.md && echo >> changelog.md && chlog >> changelog.md && cat changelog.old >> changelog.md && rm changelog.old && git add changelog.md"
}
```

Then you can `npm version major|minor|patch` like normal and update your changelog in one command and one commit.

You can install this script in your package.json by running `chlog --install` or `chlog -i`

## contributing
Pull requests and issues welcome. Follow the nodejs [code of conduct](https://github.com/nodejs/node/blob/master/CODE_OF_CONDUCT.md).

## license
copyright MMXV jden <jason@denizac.org>. available under ISC license.
