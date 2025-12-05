import App from './App';
import { FormosaConfig } from '@jlbelanger/formosa';
import React from 'react';
import ReactDOM from 'react-dom/client';

FormosaConfig.init({
	apiPrefix: import.meta.env.VITE_API_URL,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
