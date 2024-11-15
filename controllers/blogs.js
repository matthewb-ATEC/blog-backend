const blogsRouter = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    req.blog = blog
    next()
  } catch (error) {
    return res.status(400).json({ error })
  }
}

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    if (blogs) res.status(200).send(blogs)
    else res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) res.status(200).send(req.blog)
    else res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogsRouter.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    if (blog) res.status(200).send(blog)
    else res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  try {
    req.blog.likes += 1
    await req.blog.save()

    res.status(201).send(req.blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
  try {
    await Blog.destroy({ where: { id: id } })
    res.status(204).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = blogsRouter
