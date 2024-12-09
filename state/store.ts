import { configureStore } from '@reduxjs/toolkit';

import * as reducers from './reducers';

export const store = configureStore({
    reducer: {
        place: reducers.placeReducer,
        device: reducers.deviceReducer
    },
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
