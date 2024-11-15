require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)
sequelize
  .authenticate()
  .then(() => console.log('Database connection established'))
  .catch((err) => console.error('Unable to connect to the database:', err))

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
)

Blog.sync()
  .then(() => console.log('Blog table synced successfully'))
  .catch((err) => console.error('Error syncing blog table:', err))

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    if (blogs) res.status(200).send(blogs)
    else res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const id = req.params.id
    const blog = await Blog.findByPk(id)
    if (blog) res.status(200).send(blog)
    else res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    if (blog) res.status(200).send(blog)
    else res.status(404).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const id = req.params.id

    const blog = await Blog.findByPk(id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    await Blog.destroy({ where: { id: id } })
    res.status(204).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
