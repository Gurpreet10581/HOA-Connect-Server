require('dotenv').config()
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, { 
    dialect: 'postgres'
});

sequelize.authenticate()
.then(() => console.log("postgres db is connected"))
.catch(err => console.log(err));




let user= sequelize.import('./models/user');
let profile= sequelize.import('./models/profile');
let post= sequelize.import('./models/post');
let response= sequelize.import('./models/response');


user.hasOne(profile);
profile.belongsTo(user);
user.hasMany(post);//rethink about this- can delete 22 to 25
post.belongsTo(user);//rethink about this
user.hasMany(response);//rethink about this
response.belongsTo(user);//rethink about this- user can not have posts or response since it has profile so profile can all the posts and response.
post.hasMany(response);
response.belongsTo(post);
profile.hasMany(post);
post.belongsTo(profile);
// profile.hasMany(response);
// response.belongsTo(profile);


module.exports = sequelize;
