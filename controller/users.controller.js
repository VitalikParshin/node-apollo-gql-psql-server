const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "my_secret_key_a_b_c"; // Change this to an environment variable

class UsersController {
  async loginUser({ email, password }) {
    const query = `SELECT id, username, email, password FROM users WHERE email = $1`;
    const userResult = await db.query(query, [email]);

    if (userResult.rows.length === 0) {
      return {
        ok: false,
        token: null,
        error: {
          field: "email",
          message: "Invalid email",
        },
      };
    }

    const user = userResult.rows[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        ok: false,
        token: null,
        error: {
          field: "password",
          message: "Invalid password",
        },
      };
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    return {
      ok: true,
      accessToken,
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  async createUser({ username, email, password }) {
    const users = await this.getUsers();

    const isUserExist = users.find((client) => client.email === email);

    if (isUserExist) {
      return {
        ok: false,
        user: null,
        error: {
          field: "common",
          message: "User with this email already exist",
        },
      };
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `INSERT INTO users (
            username,
            email,
            password
        ) VALUES ($1, $2, $3) RETURNING id, username, email, password`;

    try {
      const newUserResult = await db.query(insertUserQuery, [
        username,
        email,
        hashedPassword,
      ]);

      const newUser = newUserResult.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, username: newUser.username },
        SECRET_KEY,
        { expiresIn: "7d" } // Token expires in 7 days
      );

      return {
        ok: true,
        accessToken: token,
        user: newUser,
      };
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
    try {
      const userQuery = `SELECT id FROM users WHERE email = $1`;
      const userResult = await db.query(userQuery, [email]);
      const userId = userResult.rows[0].id;

      if (userId) {
        await db.query(`DELETE FROM profiles WHERE user_id = $1`, [userId]);
      }

      const query = "DELETE FROM users WHERE email = $1";

      const result = await db.query(query, [email]);

      if (result.rowCount === 0) {
        return {
          ok: false,
          error: {
            field: "common",
            message: "User not found",
          },
        };
      }

      return { ok: true, error: null };
    } catch (error) {
      console.log("__error", error);
      throw new Error(error);
    }
  }

  async logoutUser(_, { res }) {
    res.clearCookie("auth_token");

    return { message: "Logged out successfully" };
  }
}

module.exports = new UsersController();
