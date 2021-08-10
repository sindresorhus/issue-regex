/**
Regular expression for matching issue references.

@example
```
import issueRegex from 'issue-regex';

'Fixes #143 and avajs/ava#1023'.match(issueRegex());
//=> ['#143', 'avajs/ava#1023']
```
*/
export default function issueRegex(): RegExp;
