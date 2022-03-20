import test from 'ava';
import issueRegex from './index.js';

const matches = [
	'#1',
	'#3223',
	'sindresorhus/dofle#33',
	'foo-bar/unicorn.rainbow#21',
	'foo/a#1',
	'a/foo#1',
	'thisorganisationnameislongbutokxxxxxxxx/foo#123',
	'foo/thisrepositorynameislongbutokxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123',
	'foo/longbutokissuenumber#1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
];

const nonMatches = [
	'#',
	'#0',
	'#x',
	'123',
	'sindresorhus/dofle',
	'sindresorhus/dofle#',
	'sindresorhus/dofle#0',
	'dofle#33',
	'#123hashtag',
	'non/-repo#123',
	'this/is/not/repo#123',
	'thisorganisationnameistoolongxxxxxxxxxxx/foo#123',
	'foo/thisrepositorynameistoolongxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123',
	'foo/thisissuenumberistoolong#11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
];

test('main', t => {
	t.deepEqual(
		'Fixes #143 and avajs/ava#1023'.match(issueRegex()),
		['#143', 'avajs/ava#1023'],
	);

	for (const x of matches) {
		t.is((issueRegex().exec(`foo ${x} bar`) || [])[0], x);
	}

	for (const x of nonMatches) {
		t.is(issueRegex().exec(`foo ${x} bar`), null);
	}
});

test('main #2', t => {
	// https://regex101.com/r/SQrOlx/12
	const actual = `#123

	Should match:

	- Plain issue: #666
	- From another repository: another/repo#123
	- Crazy formatting: ano-ther.999/re_po#123
	- In brackets: (#123), [#123], <another/repo#123>

	Should NOT match:

	- #0
	- another/repo#0
	- nonrepo#123
	- non/-repo#123
	- user_repo#123
	- this/is/not/repo#123
	- #123hashtag

	#123`;

	const expected = [
		'#123',
		'#666',
		'another/repo#123',
		'ano-ther.999/re_po#123',
		'#123',
		'#123',
		'another/repo#123',
		'#123',
	];

	t.deepEqual(actual.match(issueRegex()), expected);
});

test('capturing groups', t => {
	const match = issueRegex().exec('foo/bar#123');
	t.is(match[1], 'foo');
	t.is(match[2], 'bar');
	t.is(match[3], '123');
});
