const blogsRouter = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  req.blog = blog
  next()
}

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  if (blogs) res.status(200).send(blogs)
  else res.status(404).end()
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) res.status(200).send(req.blog)
  else res.status(404).end()
})

blogsRouter.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  if (blog) res.status(200).send(blog)
  else res.status(404).end()
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes += 1
  await req.blog.save()
  res.status(201).send(req.blog)
})

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
  await Blog.destroy({ where: { id: id } })
  res.status(204).end()
})

module.exports = blogsRouter
