#!/usr/bin/env node
'use strict'
const parseHistory = require('git-history')
const through = require('through2').obj
const spawn = require('child_process').spawn
const split = require('split')

const arg = process.argv[2]
if (arg === '-v' || arg === '--version') {
  console.log(require('./package.json').version)
  process.exit()
}

if (arg === '-i' || arg === '--install') {
  require('./install')
  process.exit()
}

const githubUrl = require('./parseRepo')()
const lastTag = require('./getLastTag')()

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
