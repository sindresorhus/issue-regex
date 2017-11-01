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
	'dofle#33'
];

test(t => {
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

	// https://regex101.com/r/SQrOlx/6
	t.deepEqual(
		`#123

Should match:

- Plain issue: #666
- From another repository: another/repo#123
- In brackets: (#123), [#123]
- Wild formatting: ano-ther.999/re_po#123

Should NOT match:

- #0
- another/repo#0
- nonrepo#123
- user_repo#123

#123`.match(m()),
		['#123', '#666', 'another/repo#123', '#123', '#123', 'ano-ther.999/re_po#123', '#123']
	);
});
