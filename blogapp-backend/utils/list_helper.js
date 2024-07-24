const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) =>  {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let mostLikes = blogs[0].likes
    let favBlog = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
            favBlog = blog
        }
    })

    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: mostLikes
    }
    
}

const mostBlogs = (blogs) => {

    if (blogs.length > 1) {

        const authors = []
        const bloggers = []

        blogs.forEach(blog => {
            if (!authors.includes(blog.author)) {
                authors.push(blog.author)
            }
        })

        authors.forEach(author => {
            bloggers.push({author: author,
            blogs: 0})
        })

        blogs.forEach(blog => {
            author = bloggers.find(blogger => blogger.author === blog.author)
            author.blogs = author.blogs + 1
        })

        let largestBlogger = bloggers[0]

        bloggers.forEach(blogger => {
            if (blogger.blogs > largestBlogger.blogs) {
                largestBlogger = blogger
            }
        })

        return {
            author: largestBlogger.author,
            blogs: largestBlogger.blogs
        }
    } else return {
        author: blogs[0].author,
        blogs: 1
    }
}

const mostLikes = (blogs) => {
    if (blogs.length > 1) {

        const authors = []
        const bloggers = []

        blogs.forEach(blog => {
            if (!authors.includes(blog.author)) {
                authors.push(blog.author)
            }
        })

        authors.forEach(author => {
            bloggers.push({author: author,
            likes: 0})
        })

        blogs.forEach(blog => {
            author = bloggers.find(blogger => blogger.author === blog.author)
            author.likes = author.likes + blog.likes
        })

        let mostLikedBlogger = bloggers[0]

        bloggers.forEach(blogger => {
            if (blogger.likes > mostLikedBlogger.likes) {
                mostLikedBlogger = blogger
            }
        })

        return {
            author: mostLikedBlogger.author,
            likes: mostLikedBlogger.likes
        }
    } else return {
        author: blogs[0].author,
        likes: blogs[0].likes
    }
}
  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }