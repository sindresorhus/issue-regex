/**
Regular expression for matching issue references.

@param prefix - Additional prefix for references like `GH-123`. Adding a prefix will still match the #-based references.

@example
```
import issueRegex from 'issue-regex';

'Fixes #143 and avajs/ava#1023'.match(issueRegex());
//=> ['#143', 'avajs/ava#1023']

'GH-143 is the same as #143'.match(issueRegex('GH-'));
//=> ['GH-143', '#143']
```
*/
export default function issueRegex(prefix?: string): RegExp;
