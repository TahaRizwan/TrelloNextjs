import { createSlice } from "@reduxjs/toolkit";
import { v4 } from 'uuid'


const initialState = {
    value: {
        [v4()]: {
            name: 'List 1',
            items: [
                { id: v4(), content: 'First task' },
                { id: v4(), content: 'Second task' },
                { id: v4(), content: 'Third task' },
                { id: v4(), content: 'Fourth task' },
                { id: v4(), content: 'Fifth task' },
            ],
        },
        [v4()]: {
            name: 'List 2',
            items: [],
        },
        [v4()]: {
            name: 'List 3',
            items: [],
        },
        [v4()]: {
            name: 'List 4',
            items: [],
        },
    }
}

export const appSlice = createSlice({
    name: 'trello',
    initialState,
    reducers: {
        newData: (state, action) => {
            state.value = action.payload
        }
    },
})

export const { newData } = appSlice.actions

export default appSlice.reducer