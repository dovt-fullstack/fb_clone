import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ApiUser } from '../api/User';
import { Auth } from '../api/Auth';
import storage from 'redux-persist/lib/storage';
import AuthReducer from './slices/Auth.slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};
const productsPersistConfig = {
  key: 'products',
  storage,
  blacklist: ['products'],
};
const rootReducer = combineReducers({
  auth: AuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [ApiUser.middleware, Auth.middleware];

export const store = configureStore({
  reducer: {
    persistedReducer,
    [ApiUser.reducerPath]: ApiUser.reducer,
    [Auth.reducerPath]: Auth.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
