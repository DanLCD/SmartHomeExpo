import { Device, Place } from "@/types/net";
import { createSlice } from "@reduxjs/toolkit";

const initialPlaces = [] satisfies Place[] as Place[];

export const placeSlice = createSlice({
    name: 'place',
    initialState: initialPlaces,
    reducers: {
        updatePlace: (state, action) => {
            const index = state.findIndex(place => place.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            } else {
                state.push(action.payload);
            }
        },
        deletePlace: (state, action) => {
            return state.filter(place => place.id !== action.payload.id);
        }
    }
});

export const { updatePlace, deletePlace } = placeSlice.actions
export const placeReducer = placeSlice.reducer;

const initialDevices = [] satisfies Device[] as Device[];

export const deviceSlice = createSlice({
    name: 'device',
    initialState: initialDevices,
    reducers: {
        updateDevice: (state, action) => {
            const index = state.findIndex(device => device.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            } else {
                state.push(action.payload);
            }
        },
        deleteDevice: (state, action) => {
            return state.filter(device => device.id !== action.payload.id);
        }
    }
});

export const { updateDevice, deleteDevice } = deviceSlice.actions
export const deviceReducer = deviceSlice.reducer;
