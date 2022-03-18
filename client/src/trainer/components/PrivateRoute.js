import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component:Component, ...rest})=> {
    return <Route {...rest} render={(props) => {
        if (localStorage.getItem("token")) {
            return <Component {...props} />
        } else {
            return <Redirect to="/" />
        }
    }}/>
}

const AdminRoute = ({component:Component, ...rest}) => {
    return <Route {...rest} render={(props) => {
        if (localStorage.getItem("token")) {
            return <Component {...props} />
        } else {
            return <Redirect to="/gym-leader/login" />
        }
    }} />
}

export default PrivateRoute;