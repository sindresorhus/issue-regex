# issue-regex

> Regular expression for matching issue references

## Install

```
$ npm install issue-regex
```

## Usage

```js
import issueRegex from 'issue-regex';

'Fixes #143 and avajs/ava#1023'.match(issueRegex());
//=> ['#143', 'avajs/ava#1023']
```

Organisation name, repository name, and issue number are also available
individually in capturing groups 1-3, or named groups `org`, `repo`, and `num`:

```js
issueRegex().exec('Fixes avajs/ava#1023'));
[
  'avajs/ava#1023',
  'avajs',
  'ava',
  '1023',
  index: 6,
  input: 'Fixes avajs/ava#1023',
  groups: [Object: null prototype] { org: 'avajs', repo: 'ava', num: '1023' }
]
```

## API

### issueRegex()

Returns a `RegExp` for matching issue references.

## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
