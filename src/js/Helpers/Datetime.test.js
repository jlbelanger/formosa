import { objectToString, stringToObject } from './Datetime';

describe('objectToString', () => {
	it('converts empty object to a string', () => {
		expect(objectToString({
			year: '',
			month: '',
			day: '',
			hour: '',
			minute: '',
			second: '',
			ampm: 'am',
		})).toEqual('');
	});

	it('converts 12:00 am to a string', () => {
		expect(objectToString({
			year: '2001',
			month: '2',
			day: '3',
			hour: '12',
			minute: '0',
			second: '0',
			ampm: 'am',
		})).toEqual('2001-02-03 05:00:00');
	});

	it('converts 6:00 am to a string', () => {
		expect(objectToString({
			year: '2001',
			month: '2',
			day: '3',
			hour: '6',
			minute: '0',
			second: '0',
			ampm: 'am',
		})).toEqual('2001-02-03 11:00:00');
	});

	it('converts 12:00 pm to a string', () => {
		expect(objectToString({
			year: '2001',
			month: '2',
			day: '3',
			hour: '12',
			minute: '0',
			second: '0',
			ampm: 'pm',
		})).toEqual('2001-02-03 17:00:00');
	});

	it('converts 6:00 pm to a string', () => {
		expect(objectToString({
			year: '2001',
			month: '2',
			day: '3',
			hour: '6',
			minute: '0',
			second: '0',
			ampm: 'pm',
		})).toEqual('2001-02-03 23:00:00');
	});
});

describe('stringToObject', () => {
	it('converts empty string to an object', () => {
		expect(stringToObject('')).toEqual({
			year: '',
			month: '',
			day: '',
			hour: '',
			minute: '',
			second: '',
			ampm: 'am',
		});
	});

	it('converts 12:00 am to an object', () => {
		expect(stringToObject('2001-02-03 05:00:00')).toEqual({
			year: '2001',
			month: 2,
			day: 3,
			hour: 12,
			minute: '00',
			second: '00',
			ampm: 'am',
		});
	});

	it('converts 6:00 am to an object', () => {
		expect(stringToObject('2001-02-03 11:00:00')).toEqual({
			year: '2001',
			month: 2,
			day: 3,
			hour: 6,
			minute: '00',
			second: '00',
			ampm: 'am',
		});
	});

	it('converts 12:00 pm to an object', () => {
		expect(stringToObject('2001-02-03 17:00:00')).toEqual({
			year: '2001',
			month: 2,
			day: 3,
			hour: 12,
			minute: '00',
			second: '00',
			ampm: 'pm',
		});
	});

	it('converts 6:00 pm to an object', () => {
		expect(stringToObject('2001-02-03 23:00:00')).toEqual({
			year: '2001',
			month: 2,
			day: 3,
			hour: 6,
			minute: '00',
			second: '00',
			ampm: 'pm',
		});
	});
});
