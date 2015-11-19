'use strict'
const execSync = require('child_process').execSync

module.exports = function getLastTag (baseDir) {
	const lastTag = execSync('git describe --abbrev=0', {cwd: baseDir || process.cwd()}).toString().trim()
	return lastTag
}