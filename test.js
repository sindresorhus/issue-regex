import test from 'ava';
import m from '.';

const matches = [
	'#1',
	'#3223',
	'sindresorhus/dofle#33',
	'foo-bar/unicorn.rainbow#21'
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
	'non/-repo#123'
];

test('main', t => {
	t.deepEqual(
		'Fixes #143 and avajs/ava#1023'.match(m()),
		['#143', 'avajs/ava#1023']
	);

	for (const x of matches) {
		t.is((m().exec(`foo ${x} bar`) || [])[0], x);
	}

	for (const x of nonMatches) {
		t.is(m().exec(`foo ${x} bar`), null);
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
		'#123'
	];

	t.deepEqual(actual.match(m()), expected);
});
