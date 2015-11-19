#!/usr/bin/env node
const pathJoin = require('path').join
const findRoot = require('find-root')
const dotjson = require('dotjson')

const script = 'mv changelog.md changelog.old && echo \"## $npm_package_version\" >> changelog.md && echo >> changelog.md && chlog >> changelog.md && cat changelog.old >> changelog.md && rm changelog.old && git add changelog.md'

const packagePath = pathJoin(findRoot(process.cwd()), 'package.json')

if (dotjson.get(packagePath, 'scripts.preversion')) {
  console.log('warning: there is already a preversion script defined; exiting...')
  process.exit()
}

dotjson.set(packagePath, {
  'scripts.preversion': script
})
console.log('installed chlog in scripts.preversion')
