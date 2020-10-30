import React from 'react'
import {checkAuth} from '../Utilities'

export const Auth = (props) => {

    return (
        checkAuth() ? props.children : <h3>Not Logged In</h3> 
    )
}

export const NotAuth = (props) => {
    return (
        checkAuth() ? null : props.children 
    )
}

