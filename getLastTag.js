'use strict'
const execSync = require('child_process').execSync

module.exports = function getLastTag (baseDir) {
  try {
    return execSync('git describe --abbrev=0', {cwd: baseDir || process.cwd()}).toString().trim()
  } catch (e) {
    return execSync('git rev-list --max-parents=0 HEAD', {cwd: baseDir || process.cwd()}).toString().trim()
  }
}
