import React, { useState } from 'react'

const initialFormValues = {
    username: '',
    password: ''
}

const Login = () => {
    const [formValues, setFormValues] = useState(initialFormValues)

    const handleFormValues = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formValues)
    }

    return (<div className='trainerLogin'>
        <h2>Login to start collecting!</h2>
        <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
                type='string'
                name='username'
                value={formValues.username}
                onChange={handleFormValues}
            />
            <label>Password</label>
            <input
                type='password'
                name='password'
                value={formValues.password}
                onChange={handleFormValues}
            />
            <button>Login</button>
        </form>
    </div>)
}

export default Login