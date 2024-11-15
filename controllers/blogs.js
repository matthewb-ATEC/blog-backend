const blogsRouter = require('express').Router()

const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  req.blog = blog
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  res.status(200).send(blogs)
})

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
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
  await Blog.destroy({ where: { id: id } })
  res.status(204).end()
})

module.exports = blogsRouter
