const readingListsRouter = require('express').Router()
const { UserBlogs } = require('../models')

readingListsRouter.get('/', async (req, res) => {
  res.status(200).send('Success')
})

readingListsRouter.post('/', async (req, res) => {
  const blog = await UserBlogs.create({
    ...req.body,
  })
  if (blog) res.status(200).send(blog)
  else res.status(404).end()
})

module.exports = readingListsRouter
