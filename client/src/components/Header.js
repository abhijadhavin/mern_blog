import React, {useEffect, useContext} from 'react'
import { Link, redirect } from 'react-router-dom'
import { UserContext } from '../UserContext'

const Header = () => {
    const {setUserInfo, userInfo} = useContext(UserContext);    
    useEffect(() => {
        
        fetch("http://localhost:8000/profile", {            	            
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
            });        
        }) 
        
    }, [setUserInfo])

     

    function logout() {
        fetch("http://localhost:8000/logout", {            	            
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            credentials: 'include',
        })
        setUserInfo(null);  
        return redirect("/");              
    }

    const username = (userInfo) ? userInfo.username : '';
  return (
    <header>
        <Link to="/" className='logo'>My Blog</Link>            
        <nav> 
            {username && (
                <>
                    <span>Hello, {username}</span>
                    <Link to="/create">Create new Post</Link>
                    <a href="#" onClick={logout}>Logout</a>
                </>
            )} 
            {!username && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )
            }                      
        </nav>            
    </header> 
  )
}

export default Header