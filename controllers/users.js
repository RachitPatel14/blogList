const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.json(users)
})
userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (!(username.length > 2 && password.length > 2)) {
        response.status(400).json({error: "username and password must at least 3 character long"})
    }
    else {
        const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name, 
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
    }
})

module.exports = userRouter