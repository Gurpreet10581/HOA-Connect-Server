require('dotenv').config();
let express =  require ('express');
let app = express();
const sequelize = require('./db');

let user= require('./controllers/usercontroller');
let profile= require('./controllers/profilecontroller');
let post= require('./controllers/postcontroller');
let response= require('./controllers/responsecontroller');


sequelize.sync();

app.use(require('./middleware/headers'));
// app.use(require('./middleware/validateSession'));


app.use(express.json());
app.use('/user', user);
app.use('/profile', profile);
app.use('/post', post);
app.use('/response', response);


app.use('/test', function(req, res){
    res.send('This is a message from the test endpoint on the server!')
})
app.listen(4000, function(){
    console.log('App is listening on the port 4000')
})