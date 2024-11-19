const readingListsRouter = require('express').Router()
const { UserBlogs } = require('../models')
const { userExtractor } = require('../util/middleware')

readingListsRouter.post('/', async (req, res) => {
  const blog = await UserBlogs.create({
    ...req.body,
  })
  if (blog) res.status(200).send(blog)
  else res.status(404).end()
})

readingListsRouter.put('/:id', userExtractor, async (req, res) => {
  const id = req.params.id

  const userBlog = await UserBlogs.findByPk(id)
  if (!userBlog) {
    return res.status(400).send({ error: 'user blog not found' })
  }

  if (req.user.id != userBlog.userId) {
    return res
      .status(400)
      .send({ error: `cannot change the read status of another user's book` })
  }

  console.log('Current read status:', userBlog.read)
  console.log('New read status:', req.body.read)

  userBlog.read = req.body.read
  await userBlog.save()
  res.status(200).send(userBlog)
})

module.exports = readingListsRouter
