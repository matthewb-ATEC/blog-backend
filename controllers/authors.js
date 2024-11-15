const authorsRotuer = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')

authorsRotuer.get('/', async (req, res) => {
  const response = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
  })
  res.status(200).json(response)
})

module.exports = authorsRotuer
