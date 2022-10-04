import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'

const initialFormValues = {
    user_name: '',
    user_password: ''

}


const LoginForm = (props) => {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [errorMessage, setErrorMessage] = useState('')
    const { setUserClaims } = props

    const navigate = useNavigate()

    const handleChange = (e) => {
        setErrorMessage('')
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
    }

    const submitForm = (e) => {
        e.preventDefault()
        const user = formValues
        BillsPcService.login({ user: user })
            .then(res => {
                setErrorMessage('')
                setUserClaims(res.data)
                navigate('/')
            }).catch(err => {
                console.log(err.response)
                setErrorMessage(err.response.data.message)
            })
    }

    return (<div className='loginForm'>
        <form onSubmit={submitForm}>
            <div className='formInputs'>
                <h2>Login</h2>
                <input
                    name='user_name'
                    type='string'
                    placeholder='Trainer Name'
                    value={formValues.user_name}
                    onChange={handleChange}
                />
                <input
                    name='user_password'
                    type='password'
                    placeholder='Password'
                    value={formValues.user_password}
                    onChange={handleChange}
                />
            </div>
            <button>Login</button>
        </form>
        <p className='error'>{errorMessage}</p>
    </div>)
}

export default LoginForm
