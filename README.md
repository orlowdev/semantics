# @priestine/semantics

[![Build Status](https://travis-ci.com/priestine/semantics.svg?branch=master)](https://travis-ci.com/priestine/semantics) [![codecov](https://codecov.io/gh/priestine/semantics/branch/master/graph/badge.svg)](https://codecov.io/gh/priestine/semantics) [![npm](https://img.shields.io/npm/dt/@priestine/semantics.svg)](https://www.npmjs.com/package/@priestine/semantics) [![npm](https://img.shields.io/npm/v/@priestine/semantics.svg)](https://www.npmjs.com/package/@priestine/semantics)

[![licence: MIT](https://img.shields.io/npm/l/@priestine/semantics.svg)](https://github.com/priestine/semantics) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://github.com/priestine/semantics)

`@priestine/semantics` automates version bumping for your projects. It determines the next version number, generates the release notes and publishes the release tag.

## Table of Contents

- [@priestine/semantics](#priestinesemantics)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Docker and GitLab CI](#docker-and-gitlab-ci)
    - [Docker image info](#docker-image-info)
    - [Manual usage](#manual-usage)
  - [Customizing behaviour](#customizing-behaviour)
    - [Command Line Options](#command-line-options)
    - [Environment Variables](#environment-variables)
  - [Temporary files](#temporary-files)
      - [Temporary file description](#temporary-file-description)
        - [.tmp.current_commit_data (Example)](#tmpcurrentcommitdata-example)
        - [.tmp.current_tag_data (Example)](#tmpcurrenttagdata-example)
        - [.tmp.version_data (Example)](#tmpversiondata-example)
        - [.tmp.current_changes.json (Example)](#tmpcurrentchangesjson-example)
      - [.tmp.changelog.md (Example)](#tmpchangelogmd-example)
  - [Supported Versions](#supported-versions)
  - [Badge](#badge)

## Features

* Automated versioning that follows [SemVer](https://semver.org/)
* Automatically generated release notes
* Simple and transparent way of releasing your code
* Support for formalized commits that follow widely adopted Conventional Commits specification
* Support for any language
* Simple integration with any CI/CD tool
* Docker image for your entertainment
* Unopinionated behaviour
* Compatibility with both Github and Gitlab

## Installation

```bash
npm i -g @priestine/semantics
```

### GitLab CI using Docker image

The easiest way to use the app is to go get the [Docker image from Docker Cloud](https://hub.docker.com/r/priestine/semantics). You can create a separate job in your `.gitlab-ci.yml` that will bump your versions. In fact, it is as simple as:

```yaml
# .gitab-ci.yml

stages:
  - versioning

versioning:
  stage: versioning
  image: priestine/semantics:latest
  script:
  - priestine-semantics --prefix=v
  only:
  - master
```

### Travis CI

```yaml
# .travis.yml

language: node_js
node_js:
  - "10"
stages:
  - name: versioning
    if: branch = master
jobs:
  include:
    - stage: versioning
      script:
        - npm install -g @priestine/semantics
        - priestine-semantics --user=$USER --password=$PASSWORD --prefix=v
```

### Docker image info

[![Docker Pulls](https://img.shields.io/docker/pulls/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics) [![Docker Stars](https://img.shields.io/docker/stars/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics) [![MicroBadger Layers](https://img.shields.io/microbadger/layers/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics) [![MicroBadger Size](https://img.shields.io/microbadger/image-size/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics)

`priestine/semantics:latest` Docker image is built from `node:10-alpine`.

There are also `priestine/semantics@alpine` version which is equal to `priestine/semantics:latest` as well as `priestine/semantics:slim` with the same contents yet based on `node:10-slim`.

Docker images are built on each `priestine/semantics` release so you can stick to the version you are comfortable with, e.g. `priestine/semantics:2.8.0-alpine` or `priestine/semantics:2.8.0-slim`.

### Manual usage

If you want to run `@priestine/semantics` yourself locally (or elsewhere except for CI) you will need [Node.js 8 or higher](https://nodejs.org/en/download/) installed on your machine. Simply install the package globally. Then, in your project directory, run:

```bash
priestine-semantics
```

## Customizing behaviour

You can customize the behaviour of `priestine-semantics` command by providing command line options. All CL options resemble ConfigInterface properties written as kebab-case keys with double hyphen (--) before the key and equals sign (=) between the key and the value (`=<value>` is optional and converts to `=true` if it wasn't provided). To provide CL options, simply provide them after the command itself, e.g.:

```bash
priestine-semantics --prefix=v --precise-version-matching
```

Alternatively, you can use environment variables. All env variables exposed by @priestine/semantics resemble ConfigInterface properties written as UPPER_SNAKE_CASE keys with an equals sign (=) between the key and the value. Unlike CL options, environment variables MUST have a value.

```bash
PREFIX=v priestine-semantics
```

### Command Line Options

* `--user=<username>` - existing user that will be associated with the release.
* `--password=<value>` - user password or access token for publishing tags.
* `--publish-tag[=<true|false>]` - if true, @priestine/semantics will attempt to publish release tag to the platform. Defaults to **true**.
* `--oldest-commits-first[=<true|false>]` - if true, commits in the release notes will be sorted chronologically, oldest to latest. Defaults to **true**.
* `--tag-message[=<true|false>]` - if true, tag release notes will be generated and added as release message when publishing. Defaults to **true**.
* `--prefix=<value>` - set prefix for newly created version (e.g. `--prefix=v -> v1.0.0`)
* `--postfix=<value>` - set postfix for newly created version (e.g. `--postfix=-beta -> 1.0.0-beta`)
* `--write-temporary-files[=<true|false>]` - if true, @priestine/semantics will create temporary files containing the data gathered during its execution (**NOTE**: temporary files are not generated if there are no reasons for version bumping)
* `--precise-version-matching[=<true|false>]` - if true, @priestine/semantics will look for previous versions with given prefix and/or postfix instead of just looking for any previous SemVer-like tag. This is helpful for leading several changelogs for various types of releases.
* `--exclude-merges[=<true|false>]` - if true, merge request commits will be excluded when evaluating changes since latest version. Defaults to **true**.

### Environment Variables

* `USER=<username>` - existing user that will be associated with the release.
* `PASSWORD=<value>` - user password or access token for publishing tags.
* `PROJECT_PATH=<value>` - project path for building the URL in chosen platform for publishing the release tag. E.g. `priestine/semantics` stored on Github will mean publishing to https://api.github.com/repos/priestine/semantics/releases.
* `PUBLISH_TAG=<true|false>` - if true, @priestine/semantics will attempt to publish release tag to the platform. Defaults to **true**.
* `OLDEST_COMMITS_FIRST=<true|false>` - if true, commits in the release notes will be sorted chronologically, oldest to latest. Defaults to **true**.
* `TAG_MESSAGE=<true|false>` - if true, tag release notes will be generated and added as release message when publishing. Defaults to **true**.
* `PREFIX=<value>` - set prefix for newly created version (e.g. `PREFIX=v -> v1.0.0`)
* `POSTFIX=<value>` - set postfix for newly created version (e.g. `POSTFIX=-beta -> 1.0.0-beta`)
* `WRITE_TEMPORARY_FILES=<true|false>` - if true, @priestine/semantics will create temporary files containing the data gathered during its execution (**NOTE**: temporary files are not generated if there are no reasons for version bumping)
* `PRECISE_VERSION_MATCHING=<true|false>` - if true, @priestine/semantics will look for previous versions with given prefix and/or postfix instead of just looking for any previous SemVer-like tag. This is helpful for leading several changelogs for various types of releases.
* `EXCLUDE_MERGES=<true|false>` - if true, merge request commits will be excluded when evaluating changes since latest version. Defaults to **true**.

## Temporary files

While running, `@priestine/semantics` generates a few temporary files for your disposal.
 
> Temporary file output will only be created if a new release is required.

#### Temporary file description

##### .tmp.current_commit_data (Example)

The commit assigned to the previous tag (if there was previous release tag in place for current project).

```text
4ed93c713f65eff843406a549c740132c99da123

```

##### .tmp.current_tag_data (Example)

Previous tag (if there was previous release tag in place for current project).

```text
2.2.3

```

##### .tmp.version_data (Example)

The version that should be assigned according to the contents of the commits.

```text
2.2.4

```

##### .tmp.current_changes.json (Example)

JSON containing all the commits that were evaluated.

```json
[
  {
    "hash": "4ed93c713f65eff843406a549c740132c99da123",
    "abbrevHash": "4ed93c7",
    "author": {
      "name": "priestine1",
      "email": "priestine1.dev@gmail.com"
    },
    "subject": "Correct writing of normalized changes to JSON",
    "body": [],
    "issueReference": "#25",
    "type": "fix",
    "breakingChanges": []
  },
  {
    "hash": "36af8aaa38cea6613c773ce55390a09d7e5898d0",
    "abbrevHash": "36af8aa",
    "author": {
      "name": "priestine1",
      "email": "priestine1.dev@gmail.com"
    },
    "subject": "Last attempt to fix publishing for today",
    "body": [],
    "issueReference": "#14",
    "type": "fix",
    "breakingChanges": []
  }
]

```

#### .tmp.changelog.md (Example)

Markdown changelog for evaluated commits.

```markdown
# 2.2.4


## Bug Fixes

`A bug fix`

* **4ed93c7**: Correct writing of normalized changes to JSON (**#25**)
* **36af8aa**: Last attempt to fix publishing for today (**#14**)

```

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Badge

Let people know that your package is published using `@priestine/semantics` by including the badge in your README:

```markdown
[![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://github.com/priestine/semantics)
```
