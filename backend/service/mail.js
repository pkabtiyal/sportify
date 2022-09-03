const nodemailer = require("nodemailer");

/**
 * @description: A trasporter object to send the emails using nodemailer service.
 */
const mail = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "sportify5709@gmail.com",
    pass: "xjsyafmmwglbafsf",
  },
});

module.exports = mail;
