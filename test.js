/* eslint-disable no-sparse-arrays -- Clearer visual comparison */

import test from 'ava';
import issueRegex from './index.js';

const matches = test.macro({
	exec(t, input, expectedArray, {message, additionalPrefix} = {}) {
		// Verify test input
		t.true(Array.isArray(expectedArray), 'Expected array, got', typeof expectedArray);
		t.is(expectedArray.length, 3, 'Expected array length 3, got', expectedArray.length);

		// Baseline match
		const match = issueRegex({additionalPrefix}).exec(input);
		t.truthy(match, `should match but doesn't${message ? `: ${message}` : ''}`);

		// Ensure that both the named capture groups and the index-based matches are correct
		t.deepEqual(match.slice(1), expectedArray, message);
		t.deepEqual(match.groups, {
			organization: expectedArray[0],
			repository: expectedArray[1],
			issueNumber: expectedArray[2],
		}, message);

		// Verify the match is unchanged when the reference appears in the middle of a string
		t.deepEqual(issueRegex({additionalPrefix}).exec(`Very #middle ${input} much/tricky#`).groups, match.groups, message);

		// Verify the match is unchanged when a prefix is specified
		if (!additionalPrefix) {
			t.deepEqual(
				issueRegex('UNICORN-').exec(input).groups,
				match.groups,
				'Specifying a prefix should not change the behavior for this reference, but it did',
			);
			t.deepEqual(
				issueRegex('').exec(input).groups,
				match.groups,
				'Specifying an empty prefix should not change the behavior for this reference, but it did',
			);
		}
	},
	title(_, input) {
		return `should match ${input}`;
	},
});

const noMatch = test.macro({
	exec(t, input, {message, additionalPrefix} = {}) {
		t.falsy(issueRegex({additionalPrefix}).exec(input), message);
		t.falsy(issueRegex({additionalPrefix}).exec(`Very #middle ${input} much/tricky#`), message);
	},
	title(_, input) {
		return `should not match ${input}`;
	},
});

// Ensure that multiple patterns can be matched at once
test('baseline', t => {
	t.deepEqual('Fixes #143, closes avajs/ava#1023 and unblocks GH-1'.match(issueRegex({additionalPrefix: 'GH-'})), [
		'#143',
		'avajs/ava#1023',
		'GH-1',
	]);
});

// Test cases for matching patterns
test(
	matches,
	'#1',
	[,, '1'],
);
test(
	matches,
	'#3223',
	[,, '3223'],
);
test(
	matches,
	'sindresorhus/dofle#33',
	['sindresorhus', 'dofle', '33'],
);
test(
	matches,
	'foo-bar/unicorn.rainbow#21',
	['foo-bar', 'unicorn.rainbow', '21'],
);
test(
	matches,
	'foo/a#1',
	['foo', 'a', '1'],
);
test(
	matches,
	'a/foo#1',
	['a', 'foo', '1'],
);
test(
	matches,
	'thisorganisationnameislongbutokxxxxxxxx/foo#123',
	['thisorganisationnameislongbutokxxxxxxxx', 'foo', '123'],
);
test(
	matches,
	'foo/thisrepositorynameislongbutokxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123',
	['foo', 'thisrepositorynameislongbutokxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '123'],
);
test(
	matches,
	'#1111111111',
	[,, '1111111111'],
);
test(
	matches,
	'foo/longbutokissuenumber#1111111111',
	['foo', 'longbutokissuenumber', '1111111111'],
);
test(
	matches,
	'foo/-#123',
	['foo', '-', '123'],
);
test(
	matches,
	'foo/-bar#123',
	['foo', '-bar', '123'],
);
test(
	matches,
	'foo/bar-#123',
	['foo', 'bar-', '123'],
);
test(
	matches,
	'foo/foo-bar#123',
	['foo', 'foo-bar', '123'],
);
test(
	matches,
	'foo/.bar#123',
	['foo', '.bar', '123'],
);
test(
	matches,
	'foo/..bar#123',
	['foo', '..bar', '123'],
);
test(
	matches,
	'foo/...#123',
	['foo', '...', '123'],
);
test(
	matches,
	'foo/_#123',
	['foo', '_', '123'],
);
test(
	matches,
	'foo/0#123',
	['foo', '0', '123'],
);
test(
	matches,
	'0/bar#123',
	['0', 'bar', '123'],
);
test(
	matches,
	'1/1#1',
	['1', '1', '1'],
);
test(
	matches,
	'Foo/Bar#1',
	['Foo', 'Bar', '1'],
);
test(
	matches,
	'#123',
	[,, '123'],
);
test(
	matches,
	'#666',
	[,, '666'],
);
test(
	matches,
	'another/repo#123',
	['another', 'repo', '123'],
);
test(
	matches,
	'ano-ther.999/re_po#123',
	['999', 're_po', '123'],
	{message: 'Organization names cannot contain dots'},
);
test(
	matches,
	'(#123)',
	[,, '123'],
);
test(
	matches,
	'[#123]',
	[,, '123'],
);
test(
	matches,
	'<another/repo#123>',
	['another', 'repo', '123'],
);
test(
	matches,
	'this/is/ok/repo#444',
	['ok', 'repo', '444'],
	{message: 'GitHub repository names can\'t contain a slash'},
);
test(
	matches,
	'this/is.ok/repo#444',
	['ok', 'repo', '444'],
	{message: 'GitHub repository names can\'t contain a dot'},
);
test(
	matches,
	'-ok/repo#444',
	['ok', 'repo', '444'],
	{message: 'GitHub repository names can\'t start with a dash'},
);
test(
	matches,
	'foo/bar.#123',
	['foo', 'bar.', '123'],
	{message: 'GitHub repository names can end with a dot'},
);
test(
	matches,
	'#999',
	[,, '999'],
);
test(
	matches,
	'forkuser#123',
	['forkuser',, '123'],
);

// Source: As of March 2022 GitHub shows an error message when trying to create an organization with a longer name. See issue #11.
test(
	matches,
	'thisorganisationnameistoolongxxxxxxxxxxx/foo#7888',
	['foo',, '7888'],
	{message: 'GitHub organization names can\'t be longer than 39 characters, so reference should be parsed as forkuser#number'},
);

// Test cases for invalid patterns
test(noMatch, '#');
test(noMatch, '#0');
test(noMatch, '#x');
test(noMatch, '123');
test(noMatch, 'sindresorhus/dofle');
test(noMatch, 'sindresorhus/dofle#');
test(noMatch, 'sindresorhus/dofle#0');
test(noMatch, '#123hashtag');

// Source: As of March 2022 the text box on the repository creation page has a maxLength of 100. See issue #11.
test(noMatch, 'foo/thisrepositorynameistoolongxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123', {
	message: 'GitHub repository names can\'t be longer than 100 characters',
});

test(noMatch, '#11111111111', {
	message: 'A GitHub issue number shouldn\'t have an infinite number of digits. Limit to 10B issues (10^10-1).',
});
test(noMatch, 'foo/thisissuenumberistoolong#11111111111');

test(noMatch, 'foo_bar/bar');
test(noMatch, '-foo/bar');
test(noMatch, 'foo-/bar');
test(noMatch, 'foo.bar/bar');

// Reserved names
test(noMatch, 'foo/.');
test(noMatch, 'foo/..');

// Custom prefix tests. The main tests already verify that prefixes don't break simple references.
test(
	matches,
	'GH-1111111111',
	[,, '1111111111'],
	{additionalPrefix: 'GH-'},
);
test(
	matches,
	'JIR:1111111111',
	[,, '1111111111'],
	{additionalPrefix: 'JIR:'},
);
