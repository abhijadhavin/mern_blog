import React, { useState, useContext } from 'react'
import {Navigate} from "react-router-dom"
import { UserContext } from '../UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext)

    async function handleSubmit(ev) {
        ev.preventDefault();
        try {
            const response  = await fetch("http://localhost:8000/login", {
                method: 'POST',			
                body: JSON.stringify({username, password}),	
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })             
            if(response.status === 200) {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                    setRedirect(true)
                })
                
            } else {
                alert("Login failed Try again later")    
            }              
        } catch (error) {
            
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }

    return (
	<form className="login" onSubmit={handleSubmit}>
        <h1>Login</h1>
		<input type="text" placeholder='Username' value={username} onChange={(ev) =>{ setUsername(ev.target.value)}}/>
		<input type="password" placeholder='Password' value={password} onChange={(ev) => { setPassword(ev.target.value)}} />
		<button>Login</button>
	</form>
    )
}

export default Login