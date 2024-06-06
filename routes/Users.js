const express = require('express')
const router = express.Router();
const {Users} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {sendMail} = require('../utils/Mailer');
const {validateToken} = require('../middlewares/AuthMiddleware')
// const rateLimit = require('express-rate-limit');

// const loginLimiter = rateLimit({
//     windowMs: 2 * 60 * 1000,
//     max: 2,
//     message: "Too many login attempts! Please wait for two minutes before logging in again.",
//   });

router.get('/', async (req, res) => {
    let result = await Users.findAll()
    res.json(result);
});

router.get('/users/role/:role', async (req, res) => {
    try {
        const role = req.params.role;
        console.log('role', role)
        let result = await Users.findAll({ where: { role: role } });
        res.json(result);
    } catch (error) {
        console.error('Error fetching users by role:', error);
        return res.status(500).json({ error: 'An error occurred while fetching users by role.' });
    }
});

router.get('/profile', validateToken, async (req, res) => {
    const id = req.user.id
    let result = await Users.findOne({
        where: {
            id: id
        },
    })
    console.log('resultawdawd', result)
    return res.json({ result });
});

router.put('/profile/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const userData = await Users.findByPk(id)
        let send = await sendMail(
            userData.email,
            'Account Deleted',
            `Hello ${userData.firstName},\n\nYou have deleted your account with the username of ${userData.username}.`,
            `<p>Hello ${userData.firstName},</p><p>You have deleted your account with the username of ${userData.username}</p>`
        )

        if(send) {
            let result = await Users.update({deletedAt: new Date()}, {where: {id: id},})
            res.json(result);
        }
        
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ error: 'Unable to delete account. Please try again later.' });
    }
    
});

router.put('/profile/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        console.log('updatedData', updatedData)

        let result = await Users.update(updatedData, { where: { id: id } });
        res.json(result);
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ error: 'Unable to update account. Please try again later.' });
    }
});


router.post('/signup', async (req, res) => {
    try {
        const {username, password, firstName, middleName, lastName, address, contactNo, email, role} = req.body;

        const checkUsername = await Users.findOne({where: {username: username}})
        const checkEmail = await Users.findOne({where: {email: email}})
        console.log('checkUsername', checkUsername)

        if(checkUsername) {
            return res.json({error: 'Username already exists'});
        } else if (checkEmail) {
            return res.json({error: 'Email already exists'});
        } else {
            console.log('username, password', username, password)
            bcrypt.hash(password, 10).then((hash) => {
                Users.create({
                    username,
                    password: hash,
                    firstName, 
                    middleName, 
                    lastName, 
                    address, 
                    contactNo, 
                    email,
                    role
                })
            })

            await sendMail(
                email,
                'Welcome to RVT Dental Clinic',
                `Hello ${username},\n\nThank you for signing up! Feel free to browse and check our offered services.`,
                `<p>Hello ${username},</p><p>Thank you for signing! Feel free to browse and check our offered services.</p>`
            );
        }
        
        return res.json({message: 'Registration Success! Check email for confirmation.'});
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Signup failed. Please try again later.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({ where: { username: username }});

        if (!user) {
            return res.json({ error: "User doesn't exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ error: "Incorrect password" });
        }

        const accessToken = jwt.sign({username: user.username, id: user.id}, "d3nt4l0ff1c3")

        return res.json(accessToken);

    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ error: "An error occurred during login" });
    }
});


router.get('/verify', validateToken, (req, res) => {
    res.json(req.user)
})

module.exports = router