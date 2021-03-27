import { normalizeOptions } from './Options';

describe('normalizeOptions', () => {
	it('normalizes objects', () => {
		expect(normalizeOptions({
			apple: 'Apple',
			peach: 'Peach',
			banana: 'Banana',
			pear: 'Pear',
		})).toEqual([
			{
				value: 'apple',
				label: 'Apple',
			},
			{
				value: 'peach',
				label: 'Peach',
			},
			{
				value: 'banana',
				label: 'Banana',
			},
			{
				value: 'pear',
				label: 'Pear',
			},
		]);
	});

	it('normalizes arrays of strings', () => {
		expect(normalizeOptions([
			'Apple',
			'Peach',
			'Banana',
			'Pear',
		])).toEqual([
			{
				value: 'Apple',
				label: 'Apple',
			},
			{
				value: 'Peach',
				label: 'Peach',
			},
			{
				value: 'Banana',
				label: 'Banana',
			},
			{
				value: 'Pear',
				label: 'Pear',
			},
		]);
	});

	it('normalizes arrays of JSON:API objects', () => {
		expect(normalizeOptions([
			{ id: '1', type: 'food', name: 'Apple' },
			{ id: '2', type: 'food', name: 'Peach' },
			{ id: '3', type: 'food', name: 'Banana' },
			{ id: '4', type: 'food', name: 'Pear' },
		], 'name', 'id')).toEqual([
			{
				id: '1',
				type: 'food',
				name: 'Apple',
				value: '1',
				label: 'Apple',
			},
			{
				id: '2',
				type: 'food',
				name: 'Peach',
				value: '2',
				label: 'Peach',
			},
			{
				id: '3',
				type: 'food',
				name: 'Banana',
				value: '3',
				label: 'Banana',
			},
			{
				id: '4',
				type: 'food',
				name: 'Pear',
				value: '4',
				label: 'Pear',
			},
		]);
	});
});
