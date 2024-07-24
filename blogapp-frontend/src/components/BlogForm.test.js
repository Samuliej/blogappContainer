import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls the callback function received as props with the right information, when blog is created', async () => {
  const createBlogMock = jest.fn()
  render(<BlogForm createBlog={createBlogMock} />)

  const titleInput = screen.getByPlaceholderText('insert title here')
  const authorInput = screen.getByPlaceholderText('insert author here')
  const urlInput = screen.getByPlaceholderText('insert url here')
  const submitButton = screen.getByText('create')

  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://www.testurl.com',
    user: null
  }

  await userEvent.type(titleInput, newBlog.title)
  await userEvent.type(authorInput, newBlog.author)
  await userEvent.type(urlInput, newBlog.url)
  await userEvent.click(submitButton)

  expect(createBlogMock).toHaveBeenCalledTimes(1)
  expect(createBlogMock).toHaveBeenCalledWith(newBlog)
})
