const userSchema = require("../schemas/userSchema");
const { ObjectId } = require("mongodb");

const User = class {
  constructor({ name, email, username, password }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await userSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });
        console.log(userExist);

        if (userExist && userExist.email === this.email)
          return reject("Email already exist");
        if (userExist && userExist.username === this.username)
          return reject("Username already exist");

        const userObj = new userSchema({
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password,
        });

        const userDb = await userObj.save();

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithKey({ key }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema
          .findOne({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { email: key },
              { username: key },
            ],
          })
          .select("+password");

        if (!userDb) return reject("User not found.");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;

//controller(User)<----->Models(Schema)
