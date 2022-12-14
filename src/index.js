import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@material-ui/styles'
import THEME from './utils/theme'
import { StateContainerProvider } from './utils/stateContainer'



ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <StateContainerProvider>
      <App />
    </StateContainerProvider>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
