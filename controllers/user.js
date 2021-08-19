const User = require('../models/User');
const Todo = require('../models/Todo');
const JWT = require('jsonwebtoken');

const signToken = userID => {
    return JWT.sign({
        iss: "Primblejamz",
        sub: userID
    }, "Primblejamz", { expiresIn: "1h" });
}

module.exports = {

    registerNewUser: (req, res) => {
        const { username, password, role } = req.body;
        User.findOne({ username }, (err, user) => {
            if (err)
                res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
            if (user)
                res.status(400).json({ message: { msgBody: "Username already exists", msgError: true } });
            else {
                const newUser = new User({ username, password, role });
                newUser.save(err => {
                    if (err)
                        res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
                    else
                        res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
                })
            }
        })
    },

    login: (req, res) => {
        if (req.isAuthenticated()) {
            const { _id, username, role } = req.user;
            const token = signToken(_id);
            res.cookie('access_token', token, { httpOnly: true, sameSite: true });
            res.status(200).json({ isAuthenticated: true, user: { username, role } });
        }
    },

    logout: (req, res) => {
        res.clearCookie('access_token')
        res.json({ user: { username: "", role: "" }, success: true });
    },

    createTodo: (req, res) => {
        const todo = new Todo(req.body);
        todo.save(err => {
            if (err)
                res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
            else {
                req.user.todos.push(todo);
                req.user.save(err => {
                    if (err)
                        res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
                    else
                        res.status(200).json({ message: { msgBody: "Successfully created todo", msgError: false } })
                })
            }
        })
    },

    getTodos: (req, res) => {
        User.findById({ _id: req.user._id }).populate('todos').exec((err, document) => {
            if (err)
                res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
            else
                res.status(200).json({ todos: document.todos, authenticated: true });

        });
    },

    admin: (req, res) => {
        if (req.user.role === 'admin') {
            res.status(200).json({ message: { msgBody: "You are admin", msgError: false } })
        }
        else
            res.status(403).json({ message: { msgBody: "You do not have admin privileges", msgError: true } })
    },

    authentication: (req, res) => {
        const { username, role } = req.user;
        res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }

}