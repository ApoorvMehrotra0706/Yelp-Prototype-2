import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Main from './components/Main';

export const history = createBrowserHistory();

// App Component
// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    return (
      // Use Browser Router to route to different pages
      <BrowserRouter history={history}>
        <div>
          {/* App Component Has a Child Component called Main */}
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}
// Export the App component so that it can be used in index.js
export default App;
