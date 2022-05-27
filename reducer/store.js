import { configureStore } from '@reduxjs/toolkit'
import appReducer from './appSlicer'
export const store = configureStore({
  reducer: {
    data:appReducer
  },
})