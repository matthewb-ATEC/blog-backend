const blogsRouter = require('express').Router()
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  req.blog = blog
  next()
}

blogsRouter.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where.title = {
      [Op.substring]: req.query.search,
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
  })

  res.status(200).send(blogs)
})

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    userId: req.user.id,
  })
  if (blog) res.status(200).send(blog)
  else res.status(404).end()
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes += 1
  await req.blog.save()
  res.status(201).send(req.blog)
})

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
  if (req.user.id === req.blog.userId) {
    await Blog.destroy({ where: { id: req.blog.id } })
    res.status(204).end()
  } else
    res.status(403).send({ error: "You cannot delete another user's blog" })
})

module.exports = blogsRouter
