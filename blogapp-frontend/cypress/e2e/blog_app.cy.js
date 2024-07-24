describe('Blog app', function() {
  const user = {
    name: 'test user',
    username: 'testuser',
    password: 'password'
  }

  const secondUser = {
    name: 'testing man',
    username: 'testman',
    password: 'secret'
  }


  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, secondUser)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('test user logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('eionnaa')
      cy.get('#login-button').click()

      cy.should('not.contain', 'test user logged in')
      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'background-color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'password' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.thisisadrill.com')
      cy.get('#create-button').click()

      cy.contains('a blog created by cypress')
    })

    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'first blog', author: 'cypress1', url: 'www.cyptest.com', user: user })
        cy.createBlog({ title: 'second blog', author: 'cypress2', url: 'www.cyptest2.com', user: user })
        cy.createBlog({ title: 'third blog', author: 'cypress3', url: 'www.cyptest3.com', user: user })
      })

      it('one of the blogs exist', function() {
        cy.contains('second blog')
        cy.contains('cypress2')
      })


      // The implementation for these two tests are done acknowledging, that if
      // there would be multiple blogs with all their information out,
      // the buttons would not likely be the correct ones
      it('a blog can be liked', function() {
        cy.contains('first blog').parent().find('button').click()
        cy.contains('www.cyptest.com')
        cy.contains('0')
        cy.contains('like').click()
        cy.contains('1')
      })

      it('a blog can be removed by the signed in user', function() {
        cy.contains('second blog').parent().find('button').click()
        cy.contains('remove').click()
        cy.contains('Blog second blog by cypress2 removed successfully.')
        cy.visit('')
        cy.get('html').should('not.contain', 'second blog')
      })
    })

    describe('a different user logged in', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'first blog', author: 'cypress1', url: 'www.cyptest.com', user: user })
        cy.contains('logout').click()
        cy.login({ username: 'testman', password: 'secret' })
        cy.createBlog({ title: 'testmans blog', author: 'testman', url: 'www.test.com', user: secondUser })
      })

      it('only an user who has added an blog can see the remove button', function() {
        cy.contains('first blog').parent().find('button').click()
        cy.contains('remove').should('not.exist')

        cy.contains('testmans blog').parent().find('button').click()
        cy.contains('remove')
      })
    })
  })

  describe('blogs are ordered according to how many likes they have', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'password' })
      cy.createBlog({ title: 'the most liked blog', author: 'cypress1', url: 'www.cyptest.com', likes: 100, user: user })
      cy.createBlog({ title: 'third most liked blog', author: 'cypress2', url: 'www.cyptest2.com', likes: 80, user: user })
      cy.contains('logout').click()

      cy.login({ username: 'testman', password: 'secret' })
      cy.createBlog({ title: 'second most liked blog', author: 'cypress2', url: 'www.cyptest2.com', likes: 99, user: user })
    })

    it('blogs are ordered with the most liked blog first', function() {
      cy.get('.blogDiv').eq(0).should('contain', 'the most liked blog')
      cy.get('.blogDiv').eq(1).should('contain', 'second most liked blog')
      cy.get('.blogDiv').eq(2).should('contain', 'third most liked blog')
    })

    it('by liking the blogs, they will switch order if another blog gets more likes', function() {
      cy.get('.blogDiv').eq(1).find('button').click()
      cy.get('.blogDiv').eq(1).get('#like-button').click()
      cy.contains('100')

      cy.get('.blogDiv').eq(1).get('#like-button').click()
      cy.contains('101')

      // blog has switched place
      cy.get('.blogDiv').eq(1).should('not.contain', 'second most liked blog')
      cy.get('.blogDiv').eq(1).should('contain', 'the most liked blog')

      cy.get('.blogDiv').eq(0).should('not.contain', 'the most liked blog')
      cy.get('.blogDiv').eq(0).should('contain', 'second most liked blog')
    })
  })


})