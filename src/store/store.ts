import { configureStore } from '@reduxjs/toolkit';
import { umiApi } from './api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [umiApi.reducerPath]: umiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(umiApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
