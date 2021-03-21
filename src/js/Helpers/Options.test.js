import normalizeOptions from './Options';

describe('normalizeOptions', () => {
	it('normalizes objects', () => {
		expect(normalizeOptions({
			apple: 'Apple',
			peach: 'Peach',
			banana: 'Banana',
			pear: 'Pear',
		})).toEqual({
			apple: 'Apple',
			peach: 'Peach',
			banana: 'Banana',
			pear: 'Pear',
		});
	});

	it('normalizes arrays of strings', () => {
		expect(normalizeOptions([
			'Apple',
			'Peach',
			'Banana',
			'Pear',
		])).toEqual({
			Apple: 'Apple',
			Peach: 'Peach',
			Banana: 'Banana',
			Pear: 'Pear',
		});
	});

	it('normalizes arrays of JSON:API objects', () => {
		expect(normalizeOptions([
			{ id: '1', type: 'food', name: 'Apple' },
			{ id: '2', type: 'food', name: 'Peach' },
			{ id: '3', type: 'food', name: 'Banana' },
			{ id: '4', type: 'food', name: 'Pear' },
		], 'name')).toEqual({
			'{"id":"1","type":"food"}': 'Apple',
			'{"id":"2","type":"food"}': 'Peach',
			'{"id":"3","type":"food"}': 'Banana',
			'{"id":"4","type":"food"}': 'Pear',
		});
	});
});
