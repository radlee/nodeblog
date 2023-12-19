
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User');
const createUser = (req, res) => {
    res.render('create-user');

}

const storeUser = async (req, res) => {

    try {
        const { image } = req.files;
        await image.mv(path.resolve(__dirname, '..', 'public/profiles', image.name))
        await User.create({
        ...req.body,
        image: `/profiles/${image.name}`,
       });
       res.redirect('/');
    } catch (error) {
        console.log(error)
    }
}

// Show User Login Page
const showLoginPage = (req, res) => {
    res.render('login') 
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user) {
            const result = await bcrypt.compare(password, user.password);
            if(result) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {
                res.redirect('/auth/login')
            }
        } else {
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.log(error)
    }
}

const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}


module.exports = {
    createUser, storeUser, showLoginPage, loginUser, logoutUser
};