import React, { useState } from 'react';

const initialFormValues = {
    user_name: '',
    user_password: ''
}

const AdminLogin = (props) => {

    const { user } = props
    const [formValues, setFormValues] = useState(initialFormValues)
    
    const updateFormValues = (e) => {
        console.log(e.target)
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
        console.log(formValues)
    }

    return (<>
        <div class='container'>
            <h2>Gym Leader/Admin Login</h2>
            <form>
                <input
                    placeholder='Gym Leader Name'
                    name='user_name'
                    value={formValues.user_name}
                    type='string'
                    onChange={updateFormValues}
                />
                <input
                    placeholder='Password'
                    name='user_password'
                    value={formValues.user_password}
                    type='password'
                    onChange={updateFormValues}
                />
                <button/>
            </form>
        </div>
    </>)
}

export default AdminLogin;