import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from "semver"
import { giteaApi, type Api } from "gitea-js"

function getGiteaApi() {
    console.log("Server url", github.context.serverUrl)
    return giteaApi(github.context.serverUrl, {
        token: core.getInput('gitea-token'), // generate one at https://gitea.example.com/user/settings/applications
    })
}

function getFallbackVersion() {
    const fallback = semver.clean(core.getInput('fallback')) || '0.0.0'
    console.log(`No tags found, using ${fallback}`);
    return fallback;
}

async function findLastVersion(api: Api<unknown>, prefix: string) {
    const {owner, repo} = github.context.repo
    console.log("Owner", owner)
    console.log("Repo", repo)

    let page = 1

    while (true) {
        const {data} = await api.repos.repoListTags(owner, repo, {page, limit: 50})
        if (data.length === 0) {
            break
        }

        for (const k in data) {
            const tag = data[k]
            if (tag.name) {
                const version = getSemverVersion(prefix, tag.name)
                if (version) {
                    console.log(`Found tag ${tag.name}`)
                    return version
                }
            }
        }

        page++
    }


    return getFallbackVersion()
}

function getSemverVersion(prefix: string, tag: string) {
    if (tag.startsWith(prefix)) {
        tag = tag.substring(prefix.length)
        const version = semver.clean(tag)
        if (version && !version.includes('-')) {
            return version
        }
    }

    return getFallbackVersion()
}

async function getLastVersion(api: Api<unknown>, prefix: string) {
    const input = core.getInput('last-version');
    if(input) {
        return getSemverVersion(prefix, input);
    }

    return findLastVersion(api, prefix);
}


async function run() {
    const prefix = core.getInput('prefix')
    const giteaApi = getGiteaApi()

    const lastVersion = await getLastVersion(giteaApi, prefix)
    console.log('Found last version', lastVersion)

    const major = semver.major(lastVersion)
    const minor = semver.minor(lastVersion)
    const patch = semver.patch(lastVersion)

    core.setOutput('major-number', major)
    core.setOutput('minor-number', minor)
    core.setOutput('patch-number', patch)
    core.setOutput('major-version', major)
    core.setOutput('minor-version', `${major}.${minor}`)
    core.setOutput('patch-version', `${major}.${minor}.${patch}`)
}

run().catch(e => core.setFailed(e.message));