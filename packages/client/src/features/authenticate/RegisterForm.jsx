import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import './assets/registerForm.css'

const initialFormValues = {
    user_name: '',
    user_email: '',
    user_favorite_gen: '',
    user_password: '',
    repeat_user_password: ''

}

const RegisterForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [errorMessage, setErrorMessage] = useState('')
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
        BillsPcService.register({ user: formValues })
            .then(res => {
                setErrorMessage('')
                setFormValues(initialFormValues)
                navigate('/collection')
            }).catch(err => {
                console.log(err.response)
                setErrorMessage(err.response.data.message)
            })
    }

    return (<div className='registerForm'>
        <form onSubmit={submitForm}>
            <div className='formInputs'>
                <h2>Register</h2>
                <input
                    name='user_name'
                    type='string'
                    placeholder='Trainer Name'
                    value={formValues.user_name}
                    onChange={handleChange}
                />
                <input
                    name='user_email'
                    type='string'
                    placeholder='Email'
                    value={formValues.user_email}
                    onChange={handleChange}
                />
                <select
                    name='user_favorite_gen'
                    type='string'
                    placeholder='Fav pkmn gen'
                    value={formValues.user_favorite_gen}
                    onChange={handleChange}
                >
                    <option value=''>Fav Pokemon Gen</option>
                    <option value='1'>Gen 1</option>
                    <option value='2'>Gen 2</option>
                    <option value='3'>Gen 3</option>
                    <option value='4'>Gen 4</option>
                    <option value='5'>Gen 5</option>
                    <option value='6'>Gen 6</option>
                    <option value='7'>Gen 7</option>
                    <option value='8'>Gen 8</option>
                    <option value='9'>Gen 9</option>
                </select>
                <input
                    name='user_password'
                    type='password'
                    placeholder='Password'
                    value={formValues.user_password}
                    onChange={handleChange}
                />
                <input
                    name='repeat_user_password'
                    type='password'
                    placeholder='Repeat Password'
                    value={formValues.repeat_user_password}
                    onChange={handleChange}
                />
            </div>
            <button>Register</button>
        </form>
        <p className='error'>{errorMessage}</p>
    </div>)
}

export default RegisterForm
