import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const OnlyUnauthorized = (props) => {
    const { userClaims } = props
    if (!userClaims) {
        return <Outlet />
    } else {
        return <Navigate to='/' />
    }
}

export default OnlyUnauthorized
