import crypto from "crypto";
import bcrypt from "bcrypt";
import randomstring from "randomstring";

const {SECRET_KEY} = process.env;

function base64Encode(data) {
  let buff = Buffer.from(data);
  return buff.toString("base64");
}

export function base64Decode(data) {
  let buff = Buffer.from(data, "base64");
  return buff.toString("ascii");
}

function sha256(salt, password: string) {
  const hash = crypto.createHash("sha512", password);
  hash.update(salt);
  return hash.digest("hex");
}

export function hashUser(date, user) {
  const data = {
    today: date,
    user_id: user.id,
    last_login: user.last_login_at?.toISOString() || null,
    password: user.password,
    email: user.email
  };
  return sha256(JSON.stringify(data), SECRET_KEY);
}

export function generatePassword(password: string) {
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

export function generateConfirmationCode() {
  return randomstring.generate({length: 16});
}

export async function comparePass(password: string, databasePassword: string) {
  return bcrypt.compare(password, databasePassword);
}

export function getPasswordResetToken(user) {
  // Convert timestamp_today to base36 as today
  const today = base64Encode(new Date().toISOString());
  const ident = base64Encode(user.id.toString());

  const hash = hashUser(today, user);
  return `${ident}/${today}-${hash}`;
}

export function decodePasswordResetToken(resetCode: string) {
  // Decode the values encoded in password reset token
  const [ident, todayHash] = resetCode.split("/");
  const [today, hash] = todayHash.split("-");

  // Return decoded values
  return {ident, today, hash};
}
