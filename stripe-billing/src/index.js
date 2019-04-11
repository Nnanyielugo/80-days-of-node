import React from 'react';
import { render } from 'react-dom';
import '@babel/polyfill';

import App from './app';

const base_element = document.getElementById('app');

render(<App />, base_element);
