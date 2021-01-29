import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_action/user_action'

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }

    const onPwdHandler = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log('Email', Email);
        console.log('Password', Password);


        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body)).then(response => {
            if (response.payload.loginSuccess) {
                props.history.push('/')
            } else {
                alert('Error')
            }
        })
    }



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>password</label>
                <input type="password" value={Password} onChange={onPwdHandler} />
                <button type="submit">Login</button>
            </form>
        </div >
    )
}

export default LoginPage;