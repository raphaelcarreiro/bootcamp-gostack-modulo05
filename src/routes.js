import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Repository from './repository';
import Main from './main';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/repository" exact component={Repository} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
