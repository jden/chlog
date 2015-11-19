'use strict'
const execSync = require('child_process').execSync
const githubUrl = require('github-url-from-git')

module.exports = function parseRepo (baseDir) {
	const remotes = execSync('git remote -v', {cwd: baseDir || process.cwd()}).toString().trim()
	const remote = /origin\s(.+)\s\(fetch\)/.exec(remotes)
	const remoteUrl = remote[1]

	return githubUrl(remoteUrl)
}