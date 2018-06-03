import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppLibrary from './AppLibrary';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppLibrary />, document.getElementById('root'));
registerServiceWorker();
