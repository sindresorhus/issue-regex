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
	'sindresorhus/dofle#0'
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
});
