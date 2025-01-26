const express = require('express');

const { graphqlHTTP } = require("express-graphql")

const cors = require('cors');

const schema = require('./schema');

const userController = require('./controller/users.controller')

const app = express();

app.use(cors());

const root = {
    getAllUsers: async () => {
        const users = await userController.getUsers()

        return users;
    },

    getUser: async ({ id }) => {
        const user = await userController.getUser({ id })

        return user;
    },

    createUser: async ({ input }) => {
        const user = await userController.createUser(input)

        return user;
    },

    addUserProfileInfo: async ({ input }) => {
        const userProfileInfo = await userController.addUserProfileInfo(input)

        return userProfileInfo;
    }
}


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root
}));

app.listen(5000, () => {
    console.log('Server is running on port 5000', 'http://localhost:5000/graphql');
});
