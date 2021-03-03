const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const generateJwt = (params = {}) => {
    return jwt.sign(params, process.env.SECRET, { expiresIn: '1h'});
};

module.exports = class UserController {

    async createUser(req, res) {
        try {
            const { name, email, password } = req.body;

            if (await User.findOne({ email: email })) {
                return res.status(400).send({ message: 'User already exists.' });
            }

            const userObject = {
                name: name,
                email: email,
                password: sha256(`${sha256(password)}${sha256(process.env.SALT)}`)
            };

            await User.create(userObject);

            return res.status(201).send({ message: 'Success', token: generateJwt({ name: name, email: email }) });
        } catch(e) {
            return res.status(400).send({ error: e.message });
        }
    }

    async listAllUsers(req, res) {
        try {
            const users = await User.find().select('-_id -__v -password');
            return res.send({ message: users });
        } catch(e) {
            return res.send({ error: e.message });
        }
    }

    async authenticateUser(req, res) {
        try {
            const { email, password } = req.body;
            const encryptedPassword = sha256(`${sha256(password)}${sha256(process.env.SALT)}`);

            const user = await User.findOne({ email: email }).select('-_id -__v');

            if (!user) {
                return res.send({ message: 'User not found.' });
            }

            if(encryptedPassword === user.password) {
                const token = generateJwt({ name: user.name, email: user.email });

                return res.send({
                    message: 'Logged in successfully.',
                    token: token
                });
            }

            return res.status(403).send({
                message: 'Invalid password.'
            });

        } catch(e) {
            return res.send({ error: e.message });
        }
    }

    async currentUser(req, res) {     
        try {
            const { email } = req.body;
            const user = await User.findOne({ email: email }).select('-_id -__v -password');

            if (!user) {
                return res.send({ message: 'User not found.' });
            }

            return res.send({ message: user });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    }
}