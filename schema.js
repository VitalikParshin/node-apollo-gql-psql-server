const { buildSchema } = require("graphql");

const schema = buildSchema(`  
    type User {
        id: ID
        username: String
        email: String
        password: String
        profile: UserProfile
    }
    
    type UserProfile {
        id: ID
        firstName: String
        lastName: String
        age: Int
    }
    
    type LoginUserError {
        field: String
        message: String
    }

    type CreateUserError {
        field: String
        message: String
    }

    type CreateUser {
        ok: Boolean
        accessToken: String
        error: CreateUserError
        user: User
    }

    type LoginUser {
        ok: Boolean
        accessToken: String
        error: LoginUserError
        user: User
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

    type DeleteUser {
        ok: Boolean
        error: DeleteUserError
    }

    type DeleteUserError {
        field: String
        message: String
    }


    type Logout {
        message: String
    }

    type Mutation {
        createUser(username: String, email: String, password: String): CreateUser
        deleteUser(email: String): DeleteUser
        addUserProfileInfo(input: UserProfileInput): UserProfile
        loginUser(email: String, password: String): LoginUser
        logoutUser: Logout
    }

`);

module.exports = schema;
