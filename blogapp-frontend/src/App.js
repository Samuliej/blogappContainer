import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.clear()
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>login</button>
    </form>
  )

  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return sortedBlogs.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        handleLike={handleLike}
        handleRemove={handleRemove}
        user={user} />
    ))
  }

  const handleLike = async (blog) => {
    console.log('handleLikessa App.js')
    console.log(blog)
    try {
      // Päivitetään lokaalisti, koska tykkäys tuli turhan hitaasti
      const updatedBlogs = blogs.map((b) => (b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
      setBlogs(updatedBlogs)
      await blogService.like(blog)
    } catch (exception) {
      console.log(exception.message)
    }
  }

  const handleRemove = async (blog) => {
    try {
      console.log('App.js remove funktiossa')
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      setNotificationMessage(`Blog ${blog.title} by ${blog.author} removed successfully.`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception.message)
    }
  }

  // Hoidettiin 5.5 yhteydessä
  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  return (
    <div>
      {  !user && <div>
        <h1>log in to application</h1>
        <Notification message={notificationMessage} />
        <Error message={errorMessage} />
        {loginForm()}
      </div>
      }
      {  user && <div>
        <h1>blogs</h1>
        <Notification message={notificationMessage} />
        <Error message={errorMessage} />
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>

        {blogForm()}
        {blogList()}
      </div>
      }
    </div>
  )
}

export default App