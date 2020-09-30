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
user.hasMany(post);
post.belongsTo(user);
user.hasMany(response);
response.belongsTo(user);
post.hasMany(response);
response.belongsTo(post);
profile.hasMany(post);
post.belongsTo(profile);


module.exports = sequelize;
