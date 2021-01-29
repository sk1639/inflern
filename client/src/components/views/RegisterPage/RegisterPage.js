import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../_action/user_action'

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }

    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    }

    const onPwdHandler = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onConfirmPwdHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    }


    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert('비밀번와 비밀번호 확인은 같아야 합니다.')
        }

        console.log('Email', Email);
        console.log('Name', Name);
        console.log('Password', Password);
        console.log('ConfirmPassword', ConfirmPassword);

        let body = {
            email: Email,
            password: Password,
            name: Name,
        }

        dispatch(registerUser(body)).then(response => {
            if (response.payload.success) {
                props.history.push('/login')
            } else {
                alert('Failed to sign up')
            }
        })
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPwdHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPwdHandler} />
                <button type="submit">JOIN</button>
            </form>
        </div >
    )
}

export default RegisterPage
