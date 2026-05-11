import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components';
import logsReducer from 'providers/ReduxStore/slices/logs';
import Console from './index';

jest.mock('providers/Theme', () => ({
  useTheme: () => ({ displayedTheme: 'light' })
}));

jest.mock('./TerminalTab', () => () => null);
jest.mock('./NetworkTab', () => () => null);
jest.mock('../Performance', () => () => null);
jest.mock('./RequestDetailsPanel', () => () => null);
jest.mock('./ErrorDetailsPanel', () => () => null);

const theme = {
  console: {
    bg: '#111',
    border: '#333',
    headerBg: '#222',
    buttonColor: '#aaa',
    buttonHoverBg: '#333',
    buttonHoverColor: '#fff',
    contentBg: '#111',
    titleColor: '#fff',
    countColor: '#aaa',
    dropdownBg: '#222',
    logHoverBg: '#222',
    messageColor: '#ddd'
  },
  font: { size: { sm: '12px', base: '14px' } },
  primary: { strong: '#f97316' },
  background: { mantle: '#181818', surface0: '#222' },
  border: { border0: '#333', radius: { sm: '4px' } },
  text: '#ddd',
  colors: { text: { green: '#22c55e', purple: '#a855f7', yellow: '#eab308', danger: '#ef4444' } }
};

const renderConsole = (logs) => {
  const store = configureStore({
    reducer: {
      logs: logsReducer,
      collections: (state = { collections: [] }) => state
    },
    preloadedState: {
      logs: {
        logs,
        maxLogs: 1000,
        isConsoleOpen: true,
        activeTab: 'console',
        filters: { log: true, info: true, warn: true, error: true },
        networkFilters: {},
        selectedRequest: null,
        selectedError: null,
        debugErrors: []
      },
      collections: { collections: [] }
    }
  });

  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Console />
      </ThemeProvider>
    </Provider>
  );
};

describe('Console', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders URL text in console logs as clickable links', () => {
    renderConsole([
      {
        id: 'log-1',
        type: 'log',
        message: 'Open https://example.com/docs for details',
        args: ['Open https://example.com/docs for details'],
        timestamp: 1778498400000
      }
    ]);

    expect(screen.getByRole('link', { name: 'https://example.com/docs' }))
      .toHaveAttribute('href', 'https://example.com/docs');
  });
});
