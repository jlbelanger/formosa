export default class FormosaConfig {
	static init(userConfig = {}) {
		window.FORMOSA_CONFIG = {
			apiPrefix: '' || userConfig.apiPrefix,
		};
	}

	static get(key) {
		return key ? window.FORMOSA_CONFIG[key] : window.FORMOSA_CONFIG;
	}

	static set(key, value) {
		window.FORMOSA_CONFIG[key] = value;
	}
}
