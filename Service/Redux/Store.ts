import { configureStore } from '@reduxjs/toolkit'
import { storeSlice } from './StoreSlice';

export const store:any = configureStore({
    reducer : storeSlice.reducer
})

/* tslint:disable-next-line */
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;