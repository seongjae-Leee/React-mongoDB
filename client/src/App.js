import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LogingPage from './components/views/LoginPage/LoginPage';
import RegistergPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LogingPage} />
          <Route exact path="/register" component={RegistergPage} />
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home입니다 어서오세요</h2>
    </div>
  );
}
function About() {
  return (
    <div>
      <h2>About 어바웃 페이지</h2>
    </div>
  );
}
function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

export default App;
