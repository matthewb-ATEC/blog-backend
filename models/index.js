const User = require('./user')
const Blog = require('./blog')
const UserBlogs = require('./userBlogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'reading_list' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_reading' })

module.exports = {
  Blog,
  User,
  UserBlogs,
}
