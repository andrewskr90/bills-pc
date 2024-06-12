import React from 'react'
import LoginForm from '../features/authenticate/LoginForm'
import RegisterForm from '../features/authenticate/RegisterForm'

const Login = (props) => {
    const { setUserClaims } = props

    return (<div className='loginPage'>
        <header>
            <h1>Bill's PC</h1>
            <p>Pokemon Card Portfolio App</p>
        </header>
        <LoginForm setUserClaims={setUserClaims} />
        {/* <RegisterForm /> */}
    </div>)
}

export default Login
