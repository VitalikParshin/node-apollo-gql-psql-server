const db = require("../db");

class UsersController {
  async createUser(input) {
    const { username, email, password } = input;

    const users = await this.getUsers();

    const isUserExist = users.find((client) => client.email === email);

    if (isUserExist) {
      throw new Error("User with this email already exist");
    }

    const insertUserQuery = `INSERT INTO users (
            username,
            email,
            password
        ) VALUES ($1, $2, $3) RETURNING id, username, email, password`;

    try {
      const newUser = await db.query(insertUserQuery, [
        username,
        email,
        password,
      ]);

      return newUser.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsers() {
    const query =
      "SELECT users.id, users.username, users.email, users.password, profiles.id as profile_id, profiles.first_name, profiles.last_name, profiles.age FROM users LEFT JOIN profiles ON users.id = profiles.user_id";

    const users = await db.query(query);

    const usersWithProfile = users.rows.map((user) => {
      if (user.profile_id === null) {
        return {
          ...user,
          profile: null,
        };
      }

      return {
        ...user,
        profile: {
          id: user.profile_id,
          firstName: user.first_name,
          lastName: user.last_name,
          age: user.age,
        },
      };
    });

    return usersWithProfile;
  }

  async getUser({ id }) {
    const query =
      "SELECT users.id, users.username, users.email, users.password, profiles.id as profile_id, profiles.first_name, profiles.last_name, profiles.age FROM users LEFT JOIN profiles ON users.id = profiles.user_id WHERE users.id = $1";

    const user = await db.query(query, [id]);

    if (!user.rows[0]) {
      return;
    }

    if (user.rows[0].profile_id === null) {
      return {
        ...user.rows[0],
        profile: null,
      };
    }

    return {
      ...user.rows[0],
      profile: {
        id: user.rows[0].profile_id,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        age: user.rows[0].age,
      },
    };
  }

  async addUserProfileInfo({ userId, firstName, lastName, age }) {
    const users = await db.query("SELECT * FROM profiles");

    const isUserExist = users.rows.find(
      (user) => user.user_id === Number(userId)
    );

    if (isUserExist) {
      throw new Error("User info already exists for this user");
    }

    const query = `INSERT INTO profiles (first_name, last_name, age, user_id) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, age`;

    const userProfile = await db.query(query, [
      firstName,
      lastName,
      age,
      userId,
    ]);

    return userProfile.rows[0];
  }

  async deleteUser(email) {
    const query = "DELETE FROM users WHERE email = $1";

    await db.query(query, [email]);

    return true;
  }
}

module.exports = new UsersController();
