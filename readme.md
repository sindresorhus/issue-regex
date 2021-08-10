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

## API

### issueRegex()

Returns a `RegExp` for matching issue references.

## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references
