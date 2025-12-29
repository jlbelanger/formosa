import {
	cleanRecord,
	cleanRelationship,
	filterByKey,
	getBody,
	getDirtyRelationships,
	getSimpleRecord,
} from './JsonApi.js';

describe('getSimpleRecord', () => {
	it('works', () => {
		expect(getSimpleRecord({ id: '1', type: 'foo', foo: 'bar' })).toEqual({ id: '1', type: 'foo' });
	});
});

describe('cleanRelationship', () => {
	describe('with an object', () => {
		it('works', () => {
			expect(
				cleanRelationship({ id: '1', type: 'foo', foo: 'bar' })
			).toEqual(
				{ id: '1', type: 'foo' }
			);
		});
	});

	describe('with an array', () => {
		it('works', () => {
			expect(
				cleanRelationship([
					{ id: '1', type: 'foo', foo: 'bar' },
					{ id: '2', type: 'foo', foo: 'bar' },
				])
			).toEqual([
				{ id: '1', type: 'foo' },
				{ id: '2', type: 'foo' },
			]);
		});
	});
});

describe('cleanRecord', () => {
	describe('with no attributes or relationships', () => {
		it('works', () => {
			expect(
				cleanRecord({ id: '1', type: 'foo', attributes: {}, relationships: {} })
			).toEqual(
				null
			);
		});
	});

	describe('with attributes only', () => {
		it('works', () => {
			expect(
				cleanRecord({ id: '1', type: 'foo', attributes: { foo: 'bar' }, relationships: {} })
			).toEqual(
				{ id: '1', type: 'foo', attributes: { foo: 'bar' } }
			);
		});
	});

	describe('with relationships only', () => {
		it('works', () => {
			expect(
				cleanRecord({ id: '1', type: 'foo', attributes: {}, relationships: { foo: 'bar' } })
			).toEqual(
				{ id: '1', type: 'foo', relationships: { foo: 'bar' } }
			);
		});
	});

	describe('with attributes and relationships', () => {
		it('works', () => {
			expect(
				cleanRecord({ id: '1', type: 'foo', attributes: { foo: 'bar' }, relationships: { foo: 'bar' } })
			).toEqual(
				{ id: '1', type: 'foo', attributes: { foo: 'bar' }, relationships: { foo: 'bar' } }
			);
		});
	});
});

describe('filterByKey', () => {
	it('works', () => {
		expect(
			filterByKey(['a', 'a.b', 'a.b.c', 'd'], 'a')
		).toEqual(
			['b', 'b.c']
		);
	});
});

describe('getDirtyRelationships', () => {
	it('works', () => {
		expect(
			getDirtyRelationships(['a', 'a.b', 'a.b.c', 'd', 'e', 'e.0', 'e.2', 'f', 'f.0.g'], 'a')
		).toEqual(
			{
				a: {
					b: {
						c: {},
					},
				},
				d: {},
				e: [
					{},
					undefined,
					{},
				],
				f: [
					{
						g: {},
					},
				],
			}
		);
	});
});

describe('getBody', () => {
	it('works', () => {
		const row = {
			id: '1',
			type: 'articles',
			name: 'Lorem ipsum',
			content: 'Dolor',
			author: {
				id: '2',
				type: 'users',
				name: 'johnd',
			},
			category: {
				id: '2',
				type: 'categories',
				name: 'Red',
			},
			tags: [
				{
					id: '3',
					type: 'tags',
					name: 'foo',
				},
				{
					id: '4',
					type: 'tags',
					name: 'bar',
				},
			],
			notes: [
				{
					id: '5',
					type: 'notes',
					content: 'Lorem ipsum.',
					user: {
						id: '6',
						type: 'users',
						name: 'marys',
					},
					citations: [
						{
							id: 'temp-1',
							type: 'citations',
							content: 'Blah',
						},
					],
				},
				{
					id: 'temp-2',
					type: 'notes',
					content: 'Dolor sit amet.',
					user: {
						id: '2',
						type: 'users',
						name: 'johnd',
					},
					citations: [],
				},
			],
		};
		const dirtyKeys = [
			'name', // Not content.
			'author', // Not category.
			'notes', // Not tags.
			'notes.0.citations',
			'notes.0.citations.0.content',
			'notes.1.content',
			'notes.1.user',
		];
		const relationshipNames = [
			'author',
			'tags',
			'notes',
			'notes.user',
			'notes.citations',
		];
		expect(getBody('PUT', 'articles', '1', { row, files: [] }, dirtyKeys, relationshipNames)).toEqual({
			data: {
				id: '1',
				type: 'articles',
				attributes: {
					name: 'Lorem ipsum',
				},
				relationships: {
					author: {
						data: {
							id: '2',
							type: 'users',
						},
					},
					notes: {
						data: [
							{
								id: '5',
								type: 'notes',
							},
							{
								id: 'temp-2',
								type: 'notes',
							},
						],
					},
				},
			},
			included: [
				{
					id: '5',
					type: 'notes',
					relationships: {
						citations: {
							data: [
								{
									id: 'temp-1',
									type: 'citations',
								},
							],
						},
					},
				},
				{
					id: 'temp-1',
					type: 'citations',
					attributes: {
						content: 'Blah',
					},
				},
				{
					id: 'temp-2',
					type: 'notes',
					attributes: {
						content: 'Dolor sit amet.',
					},
					relationships: {
						user: {
							data: {
								id: '2',
								type: 'users',
							},
						},
					},
				},
			],
		});
	});
});
