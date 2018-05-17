import React from 'react';
import { BrowserRouter as Router, Route, Link, IndexRoute, Redirect, Switch } from 'react-router-dom';

import App from './App.jsx';
import Login from './Login.jsx';
import Error from './Error.jsx';

export const renderRoutes = () => (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/home" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/user" render={props => (
                    <div>
                        <App redirect="User" title="用户管理"/>
                    </div>
                )} />
                <Route path="/draw" render={props => (
                    <div>
                        <App redirect="Draw" title="活动轨迹监测"/>
                    </div>
                )} />
                <Route component={NoMatch}/>
            </Switch>
        </div>
    </Router>
);

const Home = () => (
    <div>
        <h2>页面清单</h2>
        <ul>
            <li><Link to="/">App</Link></li>
            <li><Link to="/home">home</Link></li>
            <li><Link to="/login">login</Link></li>
            <li><Link to="/user">user</Link></li>
            <li><Link to="/nomatch">404</Link></li>
            <li><a href="http://www.flyce.cn/" target="_blank">Echo's Blog</a></li>
        </ul>
    </div>
);

const NoMatch = ({ location }) => (
    <div>
        <Error path={location.pathname}/>
    </div>
);