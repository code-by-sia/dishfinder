import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './main.css';

import Application from './components/application';
import Search from './components/search';
import Detail from './components/detail';

render(
    <Router>
      <div>
        <Route exact path="/" component={Application} />
        <Route path="/search/:location/:subject" component={Search} />
        <Route path="/item/:id" component={Detail} />
      </div>
   </Router>,
  document.getElementById('root')
);
