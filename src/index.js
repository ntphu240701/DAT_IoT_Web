import React from 'react';
import './index.scss';

import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import rootstore from './component/Redux/rootStore';
import { LanguageProvider } from './component/Lang/LanguageProvider'
import { ToolContextProvider } from './component/Context/ToolContext';
import { OverviewContextProvider } from './component/Context/OverviewContext';
import { SettingContextProvider } from './component/Context/SettingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={rootstore}>
      <LanguageProvider>
      <SettingContextProvider>
        <OverviewContextProvider>
          <ToolContextProvider>
            <App />
          </ToolContextProvider>
        </OverviewContextProvider>
      </SettingContextProvider>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);


