const express = require("express");

const { graphqlHTTP } = require("express-graphql");

const cors = require("cors");

const schema = require("./schema");

const userController = require("./controller/users.controller");

const app = express();

app.use(cors());
app.use(express.json());

const root = {
  loginUser: async ({ email, password }) => {
    const res = await userController.loginUser({ email, password });

    return res;
  },

  getAllUsers: async () => {
    const users = await userController.getUsers();

    return users;
  },

  getUser: async ({ id }) => {
    const user = await userController.getUser({ id });

    return user;
  },

  createUser: async ({ username, email, password }) => {
    const user = await userController.createUser({ username, email, password });
    return user;
  },

  addUserProfileInfo: async ({ input }) => {
    const userProfileInfo = await userController.addUserProfileInfo(input);

    return userProfileInfo;
  },

  deleteUser: async ({ email }) => {
    const response = await userController.deleteUser(email);

    return response;
  },

  logoutUser: async () => {
    const response = await userController.logoutUser();

    return response;
  },
};

app.use(
  "/graphql",
  graphqlHTTP(async (req) => {
    let user = null;

    // 🔹 Check if the request contains a token (except for login/register)
    // if (
    //   req.body.query.includes("getCurrentUser") ||
    //   req.body.query.includes("someOtherProtectedMutation")
    // ) {
    //   user = authMiddleware(req); // Authenticate the user
    // }

    return {
      schema,
      graphiql: true,
      rootValue: root,
      context: { user },
    };
  })
);

app.listen(5000, () => {
  console.log(
    "Server is running on port 5000",
    "http://localhost:5000/graphql"
  );
});
