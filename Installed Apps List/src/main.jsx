import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';

import '@/index.css';
import App from '@/App';

ReactDOM.render(
  <React.StrictMode>
    <Helmet
      defaultTitle='Forge Installed Apps List'
      titleTemplate='%s | Forge Installed Apps List'
    >
      <meta charSet='utf-8' />
      <html lang='id' amp />
    </Helmet>
    <App />
    <Toaster />
  </React.StrictMode>,
  document.getElementById('root')
);
