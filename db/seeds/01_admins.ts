// @ts-ignore
const bcrypt = require("bcrypt");

const {ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env;

function genPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return reject(err)
        return resolve(hash);
      });
    });
  });
}

exports.seed = async function (knex) {
  // Create a Knex instance for the "Admins" table
  const Admin = knex("admins");

  // Hash Password using generated salt
  const hash = await genPassword(ADMIN_PASSWORD);

  // Check if the "Admins" table is empty
  const result = await Admin.count().first();
  const count = parseInt(result.count);

  // If count is zero, execute the code
  if (count === 0) {
    try {
      // Attempt to insert Admin record
      return Admin.insert({
        name: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hash
      });
    } catch (error) {
      // Handle any errors that occur during the execution
      console.error("An error occurred:", error);
    }
  } else {
    // Handle the case when the table is not empty
    // You can choose to skip the execution or perform any other action
    console.log("Admins table is not empty. Skipping code execution.");
  }
};
