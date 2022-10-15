import { deserialize } from './JsonApi';
import { trackPromise } from 'react-promise-tracker';

export default class Api {
	static get(url, showSpinner = true) {
		return Api.request('GET', url, null, showSpinner);
	}

	static delete(url, showSpinner = true) {
		return Api.request('DELETE', url, null, showSpinner);
	}

	static post(url, body, showSpinner = true) {
		return Api.request('POST', url, body, showSpinner);
	}

	static put(url, body, showSpinner = true) {
		return Api.request('PUT', url, body, showSpinner);
	}

	static request(method, url, body = null, showSpinner = true) {
		const options = {
			method,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
			},
		};
		if (typeof body === 'string') {
			options.headers['Content-Type'] = 'application/json';
		}
		if (Api.getToken()) {
			options.headers.Authorization = `Bearer ${Api.getToken()}`;
		}
		if (body) {
			options.body = body;
		}

		let fullUrl = url;
		if (process.env.REACT_APP_API_URL && !url.startsWith('http')) {
			fullUrl = `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
		}

		const event = new CustomEvent('formosaApiRequest', { cancelable: true, detail: { url: fullUrl, options } });
		if (!document.dispatchEvent(event)) {
			return Promise.resolve();
		}

		const promise = fetch(fullUrl, options)
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
			});

		return showSpinner ? trackPromise(promise) : promise;
	}

	static getToken() {
		return window.FORMOSA_TOKEN;
	}

	static setToken(token) {
		window.FORMOSA_TOKEN = token;
	}
}
