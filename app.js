const express = require('express');
const app = express();
const { config, engine } = require('express-edge');
const expressFileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const edge = require('edge.js');
const db = require('./db')
const User = require('./models/User')

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json());
app.use(expressFileUpload());
app.use(express.urlencoded({extended: true}));


const { 
    showHomePage, 
    createPost, 
    storePost, 
    showPost 
} = require('./controllers/PostController');
const { 
    createUser,
    storeUser,
    showLoginPage,
    loginUser,
    logoutUser
} = require('./controllers/UserController');

const { authenticateUser } = require('./middlewares/auth');
const redirectIfAuthenticated = require('./middlewares/redirectIfAuthenticated')

app.use(engine);
app.set('views', `${__dirname}/views`);
app.use(session({
    secret: 'sectet',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://radlee:Leander247365@blogger.p3sz3ls.mongodb.net/blogger'
    }),
}));

app.use('*', async (req, res, next) => {
    const { userId } = req.session;
    if(userId) {
        const user = await User.findById(userId);
        edge.global('user', user);
        edge.global('userId', req.session.userId);
    }
    next();
});

// Main route rendering the 'index' template
app.get('/', showHomePage);
app.get('/posts/new', redirectIfAuthenticated, createPost);
app.post('/posts/store', storePost);
app.get('/posts/:id', showPost);
app.get('/auth/register', createUser);
app.post('/auth/register', storeUser);
app.get('/auth/login', authenticateUser, showLoginPage);
app.post('/auth/login', loginUser);
app.get('/auth/logout', logoutUser);

// Start the server
const PORT = 5700;
app.listen(PORT, () => {
    console.log(`\nServer running on PORT: ${PORT}`);
});
