const router = require('express').Router()
const { User, Blog, Team, UserBlogs } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const userFinder = async (req, res, next) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  req.user = user
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userId', 'blogId'] },
        through: {
          attributes: [],
        },
      },
    ],
  })
  res.status(200).send(users)
})

router.get('/:username', userFinder, async (req, res) => {
  const user = await User.findOne({
    where: { username: req.user.username },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userId', 'blogId'] },
        /*include: {
          model: UserBlogs,
          attributes: { exclude: ['blogId'] },
        },*/
        through: {
          attributes: [],
        },
      },
    ],
  })
  res.status(200).send(user)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).send(user)
})

router.put('/:username', userFinder, async (req, res) => {
  req.user.username = req.body.username
  await req.user.save()
  res.status(200).send(req.user)
})

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put('/:username/disabled', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
