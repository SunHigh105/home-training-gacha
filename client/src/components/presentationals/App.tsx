import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { HomeContainer } from '../containers/Home';
import { PlayerContainer } from '../containers/Player';

import '../../css/App.css';
import { InstructionModalContainer } from '../containers/InstructionModal';

export const App: FC<{}> = ({
}) => {
  return (
    <div>
      <header className='app-header'>
        <div className='app-header-wrapper'>
          <Link className='app-header-home' to='/'>Home Training Gacha</Link>
          <InstructionModalContainer />
        </div>
      </header>
      <div className='app-container'>
        <Switch>
          <Route path='/' exact component={HomeContainer} />
          <Route path='/player/minute/:minute/muscle/:muscle' component={PlayerContainer} />
          <Route path='/player/minute/:minute' component={PlayerContainer} />
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </div>
    </div>
  )
};

export default App;
