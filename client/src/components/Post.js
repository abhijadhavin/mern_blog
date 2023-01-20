import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'


const Post = ({_id, title, summary, cover, content, createdAt, author}) => {
  return (
	<div className="post">
		<div className='image'>
            <Link to={'/post/'+_id}>
			    <img alt={title} src={"http://localhost:8000/"+cover} />
            </Link>
		</div>
		<div className="texts">
			<h2>
                <Link to={'/post/'+_id}> 
                    {title} 
                </Link>    
            </h2>
			<p className='info'>
				<span className="author">{author.username}</span>
				<time>{moment(createdAt).format('DD/MM/YYYY MM:SS')}</time>
			</p>
			<p className="summary">
				{summary}
			</p>
		</div>
	</div>
  )
}

export default Post