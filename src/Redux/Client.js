import { createSlice } from '@reduxjs/toolkit';

export const UserAuth = createSlice ({
    name: 'User',
    initialState: {
        Token : null ,
        Role : null ,
        DisplayName : null ,
        Email :null,
        Id:null
    },
    reducers : {
        userLogin ( state , action){
            state.Token = action.payload.token ,
            state.Role = action.payload.role ,
            state.DisplayName = action.payload.username ,
            state.Email = action.payload.email ,
            state.Id = action.payload.id 
        },
        userLogout ( state, action){
            state.Token = null ,
            state.Role = null ,
            state.DisplayName = null ,
            state.Id = null 
        },
    }
})

export const {userLogin , userLogout } = UserAuth.actions ;

export const UserReducer = UserAuth.reducer ;