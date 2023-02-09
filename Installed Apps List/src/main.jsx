import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';

import '@/index.css';
import App from '@/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
  document.getElementById('root')
);
