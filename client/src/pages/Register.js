import React, {useState} from 'react'

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function register(ev) {
		ev.preventDefault();
        try {
            const response  = await fetch("http://localhost:8000/register", {
                method: 'POST',			
                body: JSON.stringify({username, password}),	
                headers: {
                    'Content-Type': 'application/json',
                }					 
            })  
            
            if(response.status === 200) {
                alert("Registration successfully")    
            } else {
                alert("Register failed Try again later")    
            }            
        } catch (error) {
            alert("Register failed Try again later")
        }		
	}
	return (
		<form action="" className="register" onSubmit={register}>
			<h1>Register</h1>
			<input 
				type="text" 
				placeholder='Username' 
				value={username} 
				onChange={(ev) => setUsername(ev.target.value)} 
			/>
			<input 
				type="password" 
				placeholder='Password' 
				value={password } 
				onChange={(ev) => setPassword(ev.target.value)}  
			/>
			<button>Register</button>
		</form>
	)
}

export default Register