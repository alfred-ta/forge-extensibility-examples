import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes as RouterRoutes
} from 'react-router-dom';

import Index from '@/pages/Index';
import Main from '@/pages/Main';

function Routes(props) {
  return (
    <Router>
      <RouterRoutes>
        <Route path='/' element={<Index />} />
        <Route path='/main' element={<Main />} />
      </RouterRoutes>
    </Router>
  );
}

export default Routes;
