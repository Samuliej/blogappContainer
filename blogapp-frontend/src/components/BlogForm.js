import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogUser, setNewBlogUser] = useState(null)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: newBlogUser
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
    setNewBlogUser(null)
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={addBlog}>
        title:
        <input id='title' placeholder='insert title here' value={newBlogTitle} onChange={event => setNewBlogTitle(event.target.value)} /> <br></br>

        author:
        <input id='author' placeholder='insert author here' value={newBlogAuthor} onChange={event => setNewBlogAuthor(event.target.value)} /> <br></br>

        url:
        <input id='url' placeholder='insert url here' value={newBlogUrl} onChange={event => setNewBlogUrl(event.target.value)} /> <br></br>
        <button id='create-button' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm