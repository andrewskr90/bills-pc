import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const TrainerRoute = ({component:Component, ...rest})=> {
    return <Route {...rest} render={(props) => {
        if (localStorage.getItem("token")) {
            return <Component {...props} />
        } else {
            return <Redirect to="/login" />
        }
    }}/>
}

const GymLeaderRoute = ({component:Component, ...rest}) => {
    return <Route {...rest} render={(props) => {
        if (localStorage.getItem("token")) {
            return <Component {...props} />
        } else {
            return <Redirect to="/gym-leader/login" />
        }
    }} />
}

export default { TrainerRoute, GymLeaderRoute }