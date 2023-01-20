import React from 'react'
import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';

 

const EditPost = () => {
    const [title, setTitle]= useState('');
	const [summary, setSummary]= useState('');
	const [content, setContent]= useState('');
    const [files, setFiles]= useState('');    
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();

    useEffect(() => {        
        fetch(`http://localhost:8000/post/${id}`).then(response => {
            response.json().then(post => {                  
                setTitle(post.title);
                setSummary(post.summary);                
                setContent(post.content);
            })
        })
    }, [id])

    async function updatePost(ev) {
        ev.preventDefault(); 
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]) {
            data.set('file', files?.[0]);        
        }
        const response = await fetch("http://localhost:8000/post", {
            method: "PUT",
            body: data,             
            credentials: 'include',
        });
        if(response.status === 200) {            
            setRedirect(true)
        } 
    }

    if(redirect) {        
        return <Navigate to={'/post/'+id} />
    }

	return (
		<form onSubmit={updatePost}>
			<input type="title" placeholder={'Title'} value={title} onChange={(ev) => setTitle(ev.target.value)} />
			<input type="summary" placeholder={'Summary'}  value={summary} onChange={(ev) => setSummary(ev.target.value)} />
			<input type="file" onChange={(ev) => setFiles(ev.target.files)} />
			<Editor value={content} onChange={setContent} />
            <br/>
			<button>Create Post</button>
		</form>
	)
}
export default EditPost