import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)
  const { user: blogUser } = blog

  Blog.propTypes = {
    handleLike: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    blog: PropTypes.object.isRequired
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onLikeClick = () => {
    handleLike(blog)
  }

  const onClickRemove = () => {
    if (window.confirm(`Remove blog: ${blog.title}?`))
      handleRemove(blog)
  }

  return (
    <div style={blogStyle} className='blogDiv'>
      <div className='untoggledContent'>
        {blog.title} {blog.author}  <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className='toggledContent'>
          {blog.url} <br/>
          {blog.likes} <button id='like-button' onClick={onLikeClick}>like</button> <br/>
          {blog.user.name} <br/>
          {user && blogUser && user.name === blogUser.name && (<button onClick={onClickRemove}>remove</button>)}
        </div>
      )}
    </div>
  )
}

export default Blog