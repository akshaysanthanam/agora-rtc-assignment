import logo from './logo.svg';
import './App.css';
import {JoinPage} from './pages/JoinPage';
import {SessionPages} from './pages/SessionPages'
import { RouterHook } from './utils/router';
import {Route, Switch} from 'react-router-dom'


function App() {
  return (
    <RouterHook>
      <Switch>
        <Route exact path="/session/:name" component={SessionPages}></Route>
        <Route path="/" component={JoinPage}></Route>
      </Switch>
    </RouterHook>
  );
}

export default App;
