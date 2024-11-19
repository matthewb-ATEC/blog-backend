const router = require('express').Router()
const { Session } = require('../models')
const { userExtractor } = require('../util/middleware')

router.delete('/', userExtractor, async (req, res) => {
  await Session.destroy({ where: { userId: req.user.id } })
  res.status(204).end()
})

module.exports = router
