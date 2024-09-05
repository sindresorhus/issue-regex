import test from 'ava';
import issueRegex from './index.js';

const matches = test.macro({
	exec(t, input, expected) {
		const match = issueRegex().exec(`something ${input} something`);
		t.truthy(match, `${input} should match`);

		// Check if groups matches the expected value
		t.deepEqual(match.groups, {
			organization: undefined,
			repository: undefined,
			issueNumber: undefined,
			...expected,
		});

		// Additional checks for match groups
		t.is(match[1], match.groups.organization);
		t.is(match[2], match.groups.repository);
		t.is(match[3], match.groups.issueNumber);
	},
	title(_, input) {
		return `should match ${input}`;
	},
});

const noMatch = test.macro({
	exec(t, input) {
		const match = issueRegex().exec(`something ${input} something`);
		t.falsy(match, `${input} should not match`);

		// Additional checks are not necessary since we expect no match
	},
	title(_, input) {
		return `should not match ${input}`;
	},
});

// Test cases for matching patterns
test(
	matches,
	'#1',
	{issueNumber: '1'},
);
test(
	matches,
	'#3223',
	{issueNumber: '3223'},
);
test(
	matches,
	'sindresorhus/dofle#33',
	{organization: 'sindresorhus', repository: 'dofle', issueNumber: '33'},
);
test(
	matches,
	'foo-bar/unicorn.rainbow#21',
	{organization: 'foo-bar', repository: 'unicorn.rainbow', issueNumber: '21'},
);
test(
	matches,
	'foo/a#1',
	{organization: 'foo', repository: 'a', issueNumber: '1'},
);
test(
	matches,
	'a/foo#1',
	{organization: 'a', repository: 'foo', issueNumber: '1'},
);
test(
	matches,
	'thisorganisationnameislongbutokxxxxxxxx/foo#123',
	{organization: 'thisorganisationnameislongbutokxxxxxxxx', repository: 'foo', issueNumber: '123'},
);
test(
	matches,
	'foo/thisrepositorynameislongbutokxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123',
	{organization: 'foo', repository: 'thisrepositorynameislongbutokxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', issueNumber: '123'},
);
test(
	matches,
	'#1111111111',
	{issueNumber: '1111111111'},
);
test(
	matches,
	'foo/longbutokissuenumber#1111111111',
	{organization: 'foo', repository: 'longbutokissuenumber', issueNumber: '1111111111'},
);
test(
	matches,
	'foo/-#123',
	{organization: 'foo', repository: '-', issueNumber: '123'},
);
test(
	matches,
	'foo/-bar#123',
	{organization: 'foo', repository: '-bar', issueNumber: '123'},
);
test(
	matches,
	'foo/bar-#123',
	{organization: 'foo', repository: 'bar-', issueNumber: '123'},
);
test(
	matches,
	'foo/foo-bar#123',
	{organization: 'foo', repository: 'foo-bar', issueNumber: '123'},
);
test(
	matches,
	'foo/.bar#123',
	{organization: 'foo', repository: '.bar', issueNumber: '123'},
);
test(
	matches,
	'foo/..bar#123',
	{organization: 'foo', repository: '..bar', issueNumber: '123'},
);
test(
	matches,
	'foo/...#123',
	{organization: 'foo', repository: '...', issueNumber: '123'},
);
test(
	matches,
	'foo/_#123',
	{organization: 'foo', repository: '_', issueNumber: '123'},
);
test(
	matches,
	'foo/0#123',
	{organization: 'foo', repository: '0', issueNumber: '123'},
);
test(
	matches,
	'0/bar#123',
	{organization: '0', repository: 'bar', issueNumber: '123'},
);
test(
	matches,
	'1/1#1',
	{organization: '1', repository: '1', issueNumber: '1'},
);
test(
	matches,
	'Foo/Bar#1',
	{organization: 'Foo', repository: 'Bar', issueNumber: '1'},
);
test(
	matches,
	'#123',
	{issueNumber: '123'},
);
test(
	matches,
	'#666',
	{issueNumber: '666'},
);
test(
	matches,
	'another/repo#123',
	{organization: 'another', repository: 'repo', issueNumber: '123'},
);
test(
	matches,
	'ano-ther.999/re_po#123',
	{organization: '999', repository: 're_po', issueNumber: '123'},
);
test(
	matches,
	'(#123)',
	{issueNumber: '123'},
);
test(
	matches,
	'[#123]',
	{issueNumber: '123'},
);
test(
	matches,
	'<another/repo#123>',
	{organization: 'another', repository: 'repo', issueNumber: '123'},
);
test(
	matches,
	'this/is/ok/repo#444',
	{organization: 'ok', repository: 'repo', issueNumber: '444'},
);
test(
	matches,
	'this/is.ok/repo#444',
	{organization: 'ok', repository: 'repo', issueNumber: '444'},
);
test(
	matches,
	'-ok/repo#444',
	{organization: 'ok', repository: 'repo', issueNumber: '444'},
);
test(
	matches,
	'foo/bar.#123',
	{organization: 'foo', repository: 'bar.', issueNumber: '123'},
);
test(
	matches,
	'#999',
	{issueNumber: '999'},
);

test(noMatch, '#');
test(noMatch, '#0');
test(noMatch, '#x');
test(noMatch, '123');
test(noMatch, 'sindresorhus/dofle');
test(noMatch, 'sindresorhus/dofle#');
test(noMatch, 'sindresorhus/dofle#0');
test(noMatch, 'dofle#33');
test(noMatch, '#123hashtag');

// GitHub organization names can't be longer than 39 characters as of March 2022.
// Source: GitHub shows an error message when trying to create an organization with a longer name. See issue #11.
test(noMatch, 'thisorganisationnameistoolongxxxxxxxxxxx/foo#123');

// GitHub repository names can't be longer than 100 characters as of March 2022.
// Source: The text box on the repository creation page has a maxLength of 100. See issue #11.
test(noMatch, 'foo/thisrepositorynameistoolongxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#123');

// A GitHub issue number shouldn't have an infinite number of digits. Limit to 10B issues (10^10-1).
test(noMatch, '#11111111111');
test(noMatch, 'foo/thisissuenumberistoolong#11111111111');

test(noMatch, 'foo_bar/bar');
test(noMatch, '-foo/bar');
test(noMatch, 'foo-/bar');
test(noMatch, 'foo.bar/bar');

// Reserves names
test(noMatch, 'foo/.');
test(noMatch, 'foo/..');
