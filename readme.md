# issue-regex

> Regular expression for matching issue references

## Install

```sh
npm install issue-regex
```

## Usage

```js
import issueRegex from 'issue-regex';

'Fixes #143 and avajs/ava#1023'.match(issueRegex());
//=> ['#143', 'avajs/ava#1023']
```

Organization name, repository name, and issue number are also available individually in capturing groups 1-3, or named groups `organization`, `repository`, and `issueNumber`:

```js
issueRegex().exec('Fixes avajs/ava#1023');
/*
[
	'avajs/ava#1023',
	'avajs',
	'ava',
	'1023',
	index: 6,
	input: 'Fixes avajs/ava#1023',
	groups: {
		organization: 'avajs',
		repository: 'ava',
		issueNumber: '1023'
	}
]
*/
```

## API

### issueRegex()

Returns a `RegExp` for matching issue references.

## Important

If you run the regex against untrusted user input in a server context, you should [give it a timeout](https://github.com/sindresorhus/super-regex).

**I do not consider ReDoS a valid vulnerability for this package.**

## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
