import React from 'react';
import ReactDOM from 'react-dom';
import ThemeProvider from 'anchor-ui/theme-provider';
import { colors } from './components/variables';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

// Amplify config
import Amplify from 'aws-amplify';
import config from './aws-exports';
config.Interactions = {
  bots: {
    [process.env.REACT_APP_BOT_NAME]: {
      name: process.env.REACT_APP_BOT_NAME,
      alias: process.env.REACT_APP_BOT_ALIAS,
      region: process.env.REACT_APP_BOT_REGION
    }
  }
};

Amplify.configure(config);

const Main = () => {
  return (
    <ThemeProvider color={colors.darkBlue}>
      <App />
    </ThemeProvider>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
