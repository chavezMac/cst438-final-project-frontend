import './App.css';
import {BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
