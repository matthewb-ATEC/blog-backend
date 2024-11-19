const User = require('./user')
const Blog = require('./blog')
const UserBlogs = require('./userBlogs')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'reading_list' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_reading' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog,
  User,
  UserBlogs,
  Session,
}
