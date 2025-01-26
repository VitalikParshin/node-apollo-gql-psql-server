const { buildSchema } = require('graphql');

const schema = buildSchema(`  
    type User {
        id: ID
        username: String
        email: String
        password: String
        profile: UserProfile
    }
    
    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type UserProfile {
        id: ID
        firstName: String
        lastName: String
        age: Int
    }

    input UserProfileInput {
        userId: ID
        firstName: String
        lastName: String
        age: Int
    }

    type Query {
        getAllUsers: [User]
        getUser(id: ID): User
    }

    type Mutation {
        createUser(input: UserInput): User
        deleteUser(email: String): Boolean
        addUserProfileInfo(input: UserProfileInput): UserProfile
    }

`);


module.exports = schema;