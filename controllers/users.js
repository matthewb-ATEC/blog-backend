const router = require('express').Router()
const { User, Blog } = require('../models')

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
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.status(200).send(users)
})

router.get('/:username', userFinder, async (req, res) => {
  res.status(200).send(req.user)
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

module.exports = router
