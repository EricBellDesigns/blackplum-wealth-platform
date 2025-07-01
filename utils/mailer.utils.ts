import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const {BASE_URL, SENDER_EMAIL, SENDER_PASSWORD, RECIPIENT_EMAILS} = process.env;
const defaultRecipients = RECIPIENT_EMAILS.split(",");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

function sendEmail(subject, html, emails) {
  const mailConfig = {
    from: SENDER_EMAIL,
    to: emails,
    subject,
    html,
  };

  return new Promise(function (resolve, reject) {
    mailTransporter.sendMail(mailConfig, function (err, data) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log("Email sent successfully!");
        resolve(data);
      }
    });
  });
}

function renderAndSendEmail(templateFile, context, subject, recipients = defaultRecipients) {
  return new Promise(function (resolve, reject) {
    ejs.renderFile(templateFile, context, function (err, htmlString) {
      if (err) {
        reject(err);
      } else {
        sendEmail(subject, htmlString, recipients)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

export function sendConfirmationEmail(email: string, confirmation_code: string) {
  // Prepare context properties
  const logo_url = `${BASE_URL}/logo.png`;
  const confirmation_link = `${BASE_URL}/api/account/confirm?code=${confirmation_code}`;

  const templateFile = path.resolve("templates/email", "email-confirmation.ejs");
  const subject = "Please confirm your email address!";
  const context = {logo_url, confirmation_link};

  // Compile and send email confirmation email
  return renderAndSendEmail(templateFile, context, subject, [email]);
}

export function sendPasswordResetLink(email: string, reset_code: string) {
  // Prepare context properties
  const logo_url = `${BASE_URL}/logo.png`;
  const password_reset_link = `${BASE_URL}/password/change?reset_code=${reset_code}`;

  const templateFile = path.resolve("templates/email", "password-reset.ejs");
  const subject = "Password Reset Link";
  const context = {logo_url, password_reset_link};

  // Compile and send email confirmation email
  return renderAndSendEmail(templateFile, context, subject, [email]);
}

export function sendTransactionAlert(transaction, threshold) {
  const templateFile = path.resolve("templates/email", "transaction-alert.ejs");
  const subject = `Transaction amount exceeded $${parseFloat(threshold).toLocaleString("en-US", {minimumFractionDigits: 2})} threshold!`;
  const context = {transaction, threshold};

  return renderAndSendEmail(templateFile, context, subject);
}

export function sendBalanceAlert(bankAccount, threshold) {
  const templateFile = path.resolve("templates/email", "balance-alert.ejs");
  const subject = `Account Balance amount exceeded $${parseFloat(threshold).toLocaleString("en-US", {minimumFractionDigits: 2})} threshold!`;
  const context = {bankAccount, threshold};

  return renderAndSendEmail(templateFile, context, subject);
}

export function sendRelinkRequest(email, link) {
  const templateFile = path.resolve("templates/email", "relink-request.ejs");
  const subject = "Please reconnect your bank accounts!";
  const context = {link};

  return renderAndSendEmail(templateFile, context, subject);
}