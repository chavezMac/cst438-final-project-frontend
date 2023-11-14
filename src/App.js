import './App.css';
import {BrowserRouter, Switch, Route } from 'react-router-dom';
import ListCities from './components/ListCities';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={ListCities} exact />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
