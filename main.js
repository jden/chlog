#!/usr/bin/env node
'use strict'
const parseHistory = require('git-history')
const through = require('through2').obj
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const split = require('split')

console.log(process.argv)
if (process.argv[1]){}



const githubUrl = require('./parseRepo')()
// const lastTag = require('./getLastTag')()
const lastTag = 'v2.44.2'

const log = spawn('git', ['log', lastTag + '..HEAD'], {cwd: process.cwd()})
log.stderr.pipe(process.stderr)
log.stdout
	.pipe(split())
	.pipe(parseHistory())
	.pipe(filter(commit => {
		return commit.message.startsWith('Merge pull request') 
	}))
	.pipe(map(commit => {
		let matches = /request #(\d+)/.exec(commit.message)
		let pullRequestNumber = matches[1]
		let title = commit.message.split('\n')[1]
		return {
			number: pullRequestNumber,
			title: title,
			href: githubUrl + '/pull/' + pullRequestNumber
		}
	}))
	.pipe(map(pr => {
		console.log(`* [PR #${pr.number}](${pr.href}) - ${pr.title}`)
	}))
	.on('close', () => {
		console.log('')
		process.exit()
	})

function filter (predicate) {
	return through(function (item, _, callback) {
		if (predicate(item)) {
			this.push(item)
		}
		callback()
	})
}

function map (fn) {
	return through(function (item, _, callback) {
		this.push(fn(item))
		callback()
	})
}