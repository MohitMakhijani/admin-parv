import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/AuthSlice";

const rootReducer = combineReducers({
	auth: authReducer,
});

export default rootReducer;
