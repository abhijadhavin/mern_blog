import React, {useEffect, useState} from 'react'
import Post from '../components/Post'

const Index = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/posts").then(response => {
            response.json().then(posts =>{                
                setPosts(posts)
            })
        })
    }, [])

    return (
        <>
        {posts.length > 0 && posts.map((post, index)=> (
            <Post {...post} key={post._id}/>
        ))}            
        </>    
    )
}

export default Index