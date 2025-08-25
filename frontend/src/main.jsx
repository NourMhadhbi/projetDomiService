import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import store from './redux/store';
import { Provider } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

import {
  persistStore,
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
let persistor = persistStore(store)
const clientId = "986273610683-6b1bhqgjlrjf47olvu030lu63f0gq2rk.apps.googleusercontent.com";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
