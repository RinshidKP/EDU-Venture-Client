import { createSlice } from '@reduxjs/toolkit';

export const UserAuth = createSlice ({
    name: 'User',
    initialState: {
        Token : null ,
        Role : null ,
        DisplayName : null ,
        DisplayImage:null ,
        Email :null,
        Id:null
    },
    reducers : {
        userLogin ( state , action){
            state.Token = action.payload.token ,
            state.Role = action.payload.role ,
            state.DisplayName = action.payload.username ,
            state.DisplayImage = action.payload.image ,
            state.Email = action.payload.email ,
            state.Id = action.payload.id 
        },
        userLogout ( state){
            state.Token = null ,
            state.Role = null ,
            state.DisplayName = null ,
            state.DisplayImage = null ,
            state.Id = null 
        },
    }
})

export const {userLogin , userLogout } = UserAuth.actions ;

export const UserReducer = UserAuth.reducer ;