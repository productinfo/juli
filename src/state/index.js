/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import appLock from './app-lock/reducers';
import dialogAddWorkspace from './dialog-add-workspace/reducers';
import dialogAppLock from './dialog-app-lock/reducers';
import dialogAuth from './dialog-auth/reducers';
import dialogCodeInjection from './dialog-code-injection/reducers';
import dialogCustomUserAgent from './dialog-custom-user-agent/reducers';
import dialogEditWorkspace from './dialog-edit-workspace/reducers';
import dialogGoToUrl from './dialog-go-to-url/reducers';
import dialogInternalUrls from './dialog-internal-urls/reducers';
import dialogRefreshInterval from './dialog-refresh-interval/reducers';
import dialogSpellcheckLanguages from './dialog-spellcheck-languages/reducers';
import dialogWorkspacePreferences from './dialog-workspace-preferences/reducers';
import findInPage from './find-in-page/reducers';
import general from './general/reducers';
import notifications from './notifications/reducers';
import preferences from './preferences/reducers';
import systemPreferences from './system-preferences/reducers';
import user from './user/reducers';
import workspaceMetas from './workspace-metas/reducers';
import workspaces from './workspaces/reducers';

import loadListeners from '../listeners';

const rootReducer = combineReducers({
  appLock,
  dialogAddWorkspace,
  dialogAppLock,
  dialogAuth,
  dialogCodeInjection,
  dialogCustomUserAgent,
  dialogEditWorkspace,
  dialogGoToUrl,
  dialogInternalUrls,
  dialogRefreshInterval,
  dialogSpellcheckLanguages,
  dialogWorkspacePreferences,
  findInPage,
  general,
  notifications,
  preferences,
  systemPreferences,
  user,
  workspaceMetas,
  workspaces,
});

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );

  loadListeners(store);

  return store;
};

export default configureStore;
