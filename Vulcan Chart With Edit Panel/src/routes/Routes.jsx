import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes as RouterRoutes
} from 'react-router-dom';

import Index from '@/pages/Index';
import Edit from '@/pages/Edit';


function Routes() {
  return (
    <Router>
      <RouterRoutes>
        <Route path='/' element={<Index />} />
        <Route path='/edit' element={<Edit />} />
      </RouterRoutes>
    </Router>
  );
}

export default Routes;
