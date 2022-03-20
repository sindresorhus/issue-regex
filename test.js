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

	// GitHub organization names can't be longer than 39 characters
	// as of March 2022.
	// Source: GitHub shows an error message when trying to create
	// an organization with a longer name. See issue #11.
	'thisorganisationnameistoolongxxxxxxxxxxx/foo#123',

	// GitHub repository names can't be longer than 100 characters
	// as of March 2022.
	// Source: The text box on the repository creation page has a
	// maxLength of 100. See issue #11.
	'foo/thisrepositorynameistoolongxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123',

	// A GitHub issue number shouldn't have an infinite number of digits. It's
	// difficult to choose a cut-off point here because GitHub hasn't published
	// any information on limits on the number of issues per repository. Here we
	// choose a (completely arbitrary) limit of 10^100. This can probably be set
	// much lower, but how much lower? The closer we get to a realistic number,
	// the higher the likelihood of a false negative.
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

	t.is(match.groups.org, 'foo');
	t.is(match.groups.repo, 'bar');
	t.is(match.groups.num, '123');
});
