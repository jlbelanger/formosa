import { deserialize } from './JsonApi';
import { trackPromise } from 'react-promise-tracker';

export default class Api {
	static get(url) {
		return Api.request('GET', url);
	}

	static delete(url) {
		return Api.request('DELETE', url);
	}

	static post(url, body) {
		return Api.request('POST', url, body);
	}

	static put(url, body) {
		return Api.request('PUT', url, body);
	}

	static request(method, url, body = null) {
		const options = {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
		};
		if (Api.getToken()) {
			options.headers.Authorization = `Bearer ${Api.getToken()}`;
		}
		if (body) {
			options.body = body;
		}

		return trackPromise(
			fetch(`${process.env.REACT_APP_API_URL}/${url}`, options)
				.then((response) => {
					if (!response.ok) {
						return response.json()
							.then((json) => {
								json.status = response.status;
								throw json;
							})
							.catch((error) => {
								if (error instanceof SyntaxError) {
									throw { // eslint-disable-line no-throw-literal
										errors: [
											{
												title: 'The server returned invalid JSON.',
												status: '500',
											},
										],
										status: 500,
									};
								} else {
									throw error;
								}
							});
					}
					if (response.status === 204) {
						return {};
					}
					return response.json();
				})
				.then((json) => {
					if (Object.prototype.hasOwnProperty.call(json, 'data')) {
						return deserialize(json);
					}
					return json;
				})
		);
	}

	static getToken() {
		return window.FORMOSA_TOKEN;
	}

	static setToken(token) {
		window.FORMOSA_TOKEN = token;
	}
}
