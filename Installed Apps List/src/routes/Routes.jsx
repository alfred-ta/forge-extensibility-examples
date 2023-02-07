import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes as RouterRoutes
} from 'react-router-dom';

import Index from '@/pages/Index';
import Main from '@/pages/Main';

import Context from './Context';

function Routes(props) {
  const [serverUserId, setServerUserId] = useState('');
  return (
    <Context.Provider value={{ serverUserId, setServerUserId }}>
      <Router>
        <RouterRoutes>
          <Route path='/' element={<Index />} />
          <Route path='/main' element={<Main />} />
        </RouterRoutes>
      </Router>
    </Context.Provider>
  );
}

export default Routes;
