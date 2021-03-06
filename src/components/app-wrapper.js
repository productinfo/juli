/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider as MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import connectComponent from '../helpers/connect-component';
import getStaticGlobal from '../helpers/get-static-global';

import WindowsTitleBar from './shared/windows-title-bar';
import AppLock from './app-lock';
import AuthManager from './auth-manager';

import { clearUserState, updateUserAsync } from '../state/user/actions';

import firebase from '../firebase';

import { requestCheckAuthJson } from '../senders';

const AppWrapper = ({
  children,
  shouldUseDarkColors,
  isFullScreen,
  locked,
  onClearUserState,
  onUpdateUserAsync,
}) => {
  // docs: https://github.com/firebase/firebaseui-web-react
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        onClearUserState();
        return;
      }

      onUpdateUserAsync();
    });
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, [onClearUserState, onUpdateUserAsync]);

  useEffect(() => {
    requestCheckAuthJson();
  }, []);

  const themeObj = {
    typography: {
      fontFamily: '"Roboto",-apple-system,BlinkMacSystemFont,"Segoe UI",Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      fontSize: 13.5,
    },
    palette: {
      type: shouldUseDarkColors ? 'dark' : 'light',
      primary: {
        light: blue[300],
        main: blue[600],
        dark: blue[800],
      },
      secondary: {
        light: red[300],
        main: red[500],
        dark: red[700],
      },
    },
  };

  if (!shouldUseDarkColors) {
    themeObj.background = {
      primary: grey[200],
    };
  }

  const theme = createMuiTheme(themeObj);

  const showWindowsTitleBar = window.process.platform !== 'darwin' && !isFullScreen && !getStaticGlobal('useSystemTitleBar');

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <div
          style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          {showWindowsTitleBar && <WindowsTitleBar title={window.mode !== 'main' ? document.title : undefined} />}
          <div style={{ height: showWindowsTitleBar ? 'calc(100vh - 32px)' : '100vh' }}>
            {locked ? <AppLock /> : children}
          </div>
          <AuthManager />
        </div>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

AppWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  shouldUseDarkColors: PropTypes.bool.isRequired,
  onClearUserState: PropTypes.func.isRequired,
  onUpdateUserAsync: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isFullScreen: state.general.isFullScreen,
  locked: window.mode !== 'about' && state.general.locked,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

const actionCreators = {
  clearUserState,
  updateUserAsync,
};

export default connectComponent(
  AppWrapper,
  mapStateToProps,
  actionCreators,
  null,
);
