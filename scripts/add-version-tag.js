#!/usr/bin/env node

const util = require('util')
const version = require('../package.json').version
const exec = util.promisify(require('child_process').exec)

const checkGitTag = async (tag) => {
	const {
		stdout,
		stderr
	} = await exec('git tag')

	if (stderr) {
		throw new Error(stderr)
	}

	if (stdout.includes(`v${tag}`)) {
		throw new Error(`Git tag v${tag} already exists: aborting`)
	}
}

const setGitTag = async (tag) => {
	const {
		stderr
	} = await exec(`git tag -a v${tag} -m "v${tag}"`)

	if (stderr) {
		throw new Error(stderr)
	}
}

const run = async () => {
	try {
		await checkGitTag(version)
		await setGitTag(version)
		console.log(`Added git tag v${version}`)
	} catch (error) {
		console.error(error.message)
	}
}

run()
