import { configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "./Client";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key:'admin',
    storage
}

const persistUserReducer = persistReducer(persistConfig,UserReducer);

export const store = configureStore ({
    reducer: {
        User:persistUserReducer
    }
});

export const persistor = persistStore(store);