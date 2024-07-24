import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () => {
  let container
  // Dummy functions for filling handleLike and handleRemove
  const handleLike = jest.fn()
  const handleRemove = jest.fn()

  const user = {
    username: 'testikäyttäjä',
    name: 'testi käyttäjä'
  }

  const blog = {
    title: 'this is a test blog',
    author: 'test author',
    url: 'https://www.testwebsite.com',
    likes: 10,
    user: user
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
    ).container
  })


  test('at start renders only the title and the author', () => {
    const renderedDiv = container.querySelector('.untoggledContent')
    const unrenderedDiv = container.querySelector('.toggledContent')

    // renderedDiv has only the title and author fields
    expect(renderedDiv).toBeDefined()
    // unrenderedDiv has the url and likes fields
    expect(unrenderedDiv).toBeNull()
  })


  test('clicking the view button renders the hidden fields', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.toggledContent')
    expect(div).not.toHaveStyle('display: none')
  })

  
  test('renders the blog title', () => {
    const titleElement = screen.getByText('this is a test blog', { exact: false })
    expect(titleElement).toBeDefined()
  })


  test('renders the blog author', () => {
    const authorElement = screen.getByText('test author', { exact:false })
    expect(authorElement).toBeDefined()
  })


  test('renders the blog url when the button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('https://www.testwebsite.com', { exact: false })
    expect(urlElement).toBeDefined()
  })


  test('renders the blog likes when the button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeElement = screen.getByText('10', { exact: false })
    expect(likeElement).toBeDefined()
  })


  test('renders the user who added the blog when the button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const userElement = screen.getByText('testi käyttäjä', { exact: false })
    expect(userElement).toBeDefined()
  })


  test('if like button is called twice, the corresponding event handler is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
  
    expect(handleLike).toHaveBeenCalledTimes(2)
  })

})