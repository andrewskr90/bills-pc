import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../features/authenticate/LoginForm/index.jsx';

const GymLeaderOnly = (props) => {
    const { userClaims, setUserClaims } = props
    const navigate = useNavigate()
    useEffect(() => {
        if (userClaims) {
            if (userClaims.user_role !== 'GymLeader') {
                navigate('/collection')
            }
        }
    }, [])
    return userClaims ? <>
        {props.children}
    </> : <>
        <LoginForm setUserClaims={setUserClaims} />
    </>
}

export default GymLeaderOnly
