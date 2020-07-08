import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Home from './scenes/Home';
import Success from './scenes/Success';
import { MemoryRouter as Router, Route } from 'react-router-dom'; //memory router - hide url of redirects
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/" >
        <Home />
      </Route>
      <Route path="/success">
        <Success />
      </Route>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
