//Author@Soham Kansodaria(B00865680)
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user");
const InvalidToken = require("../models/invalidToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mail = require("../service/mail");

const emailAddress = "sportify5709@gmail.com";

const mailUrl = process.env.FRONTEND_URL;


const register = async (request, response) => {
  const email = request.body.email;
  const isUserExists = await User.findOne({ email: email });
  console.log(isUserExists);
  try {
    if (isUserExists) {
      return response.status(202).json({
        message:
          "Account already exists with this email.So, please try logging in.",
      });
    } else {
      console.log(request.body.password);
      const salt = await bcrypt.genSalt(8);
      console.log(salt);
      const encryptedPassword = await bcrypt.hash(request.body.password, salt);
      console.log(encryptedPassword);

      let tokenData = {
        time: new Date(),
        email: email,
      };

      const jwtSecretKey = process.env.SECRET_KEY;
      const jwtToken = jwt.sign(tokenData, jwtSecretKey);

      console.log(jwtToken);

      const user = new User({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        contactNo: request.body.contactNo,
        address: "",
        profile: "user",
        password: encryptedPassword,
        verificationToken: jwtToken,
        isVerify: false,
      });

      const result = await user.save();

      const mailContent = {
        from: emailAddress,
        to: request.body.email,
        subject: "Sportify New User Registartion Verification",
        html: `<p>Hi ${request.body.firstName}, your user account created successfully but you have to verify your account. Link to verify is below: <br/> <a href=${mailUrl}/verify-account?token=${jwtToken}>Verify Now</a><br/> Thanks, Sportify Team</p>`,
      };

      mail.sendMail(mailContent, function (error, info) {
        if (error) {
          console.log(error);
          response.status(200).json({
            message: "Account registered successfully, but mail not send",
          });
        } else {
          response
            .status(200)
            .json({ message: "Account registered successfully" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const verifyAccount = async (request, response) => {
  const token = request.query.token;
  console.log(token);
  if (token == null || token == undefined) {
    return response.status(400).send({
        message:
          "No token found.",
      });
  } else {
    try {
      const userExists = await User.findOne({ verificationToken: token });
      console.log(userExists);
      if (!userExists) {
        return response.status(400).send({
          message:
            "No account associated with given request for verification or link is not valid",
        });
      }
      userExists.isVerify = true;
      await userExists.save();
      response.status(200).json({
        message: `Thank you, ${userExists.firstName}. Your account successfully verified`,
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal Server error" });
    }
  }
};

const signin = async (request, response) => {
  console.log(mailUrl);
  const requestBody = request.body;

  const targetEmail = requestBody.email;
  const targetPassword = requestBody.password;
  try {
    const userExists = await User.findOne({ email:targetEmail });
    console.log(userExists);
    if (userExists) {
      // if user verify check
      if (userExists.isVerify) {
        const checkPassword = await bcrypt.compare(
          targetPassword,
          userExists.password
        );
        console.log(checkPassword);
        // password match in database
        if (checkPassword) {
          const accessToken = jwt.sign(
            { email: userExists.email, id: userExists._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          //   removing unwanted details
          const encodedUser = (({
            password,
            verificationToken,
            isVerify,
            __v,
            ...newUser
          }) => newUser)(userExists._doc);
          response.status(200).json({
            accessToken: accessToken,
            user: encodedUser,
            message: "Successfully Login",
          });
        }
        // password not matched with data base
        else {
          response.status(401).json({
            message: "Invalid password, try again",
          });
        }
      }
      //    account is not verified yet
      else {
        response.status(202).json({
          message: `Hi ${userExists.firstName}, first you have to verify your account`,
        });
      }
    }
    // no account exists with given mail in database
    else {
      response.status(404).json({
        message: "No account is connected with given email id.",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const signOut = async (request,response) => {
  const accessToken = request.headers["access-token"];
  console.log(accessToken);
  try{
    const newInvalidToken = new InvalidToken({
      jwtToken : accessToken
    })
    const invalidToken = await newInvalidToken.save();
    console.log("invalid token save"+invalidToken);
    if(invalidToken){
      response.status(200).json({ message: "You successfully logout" });
    }
  }
  catch(error){
    response.status(500).json({ message: "Internal Server error" });
  }

}

const editProfile = async (request, response) => {
  const requestBody = request.body;
  const targetId = requestBody._id;
  const targetUser = requestBody.user;
  console.log(targetId);
  console.log(targetUser);

  try {
    const isUserFound = await User.countDocuments({ _id: targetId });
    console.log(isUserFound);
    if (isUserFound > 0) {
      console.log("user exists");
      const updatedUser = await User.findByIdAndUpdate(
        targetId,
        { ...targetUser, targetId },
        { new: true }
      ).exec();
      const encodedUser = (({
        password,
        verificationToken,
        isVerify,
        __v,
        ...newUser
      }) => newUser)(updatedUser._doc);
      response.status(200).json({
        message: "User details updated successfully",
        user: encodedUser,
      });
    } else {
      console.log("user not exists");
      response.status(404).json({ message: "User Not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const resetPassword = async (request, response) => {
  const requestBody = request.body;
  const targetEmail = requestBody.email;

  try {
    const userExists = await User.findOne({ email: targetEmail });

    if (userExists) {
      const userId = userExists._id;

      console.log(userId);
      let tokenData = {
        time: new Date(),
        email: targetEmail,
      };

      const jwtSecretKey = process.env.SECRET_KEY;
      const jwtToken = jwt.sign(tokenData, jwtSecretKey);

      console.log(jwtToken);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { verificationToken: jwtToken },
        { new: true }
      ).exec();
      console.log(updatedUser);
      console.log(targetEmail);
      console.log(emailAddress);
      const mailContent = {
        from: emailAddress,
        to: targetEmail,
        subject: "Sportify Password Reset",
        html: `<p>Hi ${userExists.firstName}, you requested for password reset. So, link to reset password is below: <br/> <a href=${mailUrl}/change-password?token=${jwtToken}>Reset Password</a><br/> Thanks, Sportify Team</p>`,
      };

      mail.sendMail(mailContent, function (error, info) {
        if (error) {
          console.log(error);
          response.status(404).json({ message: "Some error sending mail." });
        } else {
          response
            .status(200)
            .json({ message: "Password Reset request successful." });
        }
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const resetPasswordCheck = async (request, response) => {
  const token = request.query.token;
  console.log("token params " + token);
  if (token == null || token == undefined) {
    return response.status(404).send({
      message: "No token found.",
    });
  } else {
    try {
      const userExists = await User.findOne({ verificationToken: token });
      console.log(userExists);
      if (!userExists) {
        return response.status(404).send({
          message:
            "No account associated with given request for verification or link is invalid.",
        });
      }
      userExists.isVerify = true;
      await userExists.save();
      response.status(200).json({
        message: `Link for reset password is valid now you can change the password`,
        mail: userExists.email,
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal Server error" });
    }
  }
};

const changePassword = async (request, response) => {
  const requestBody = request.body;
  const email = requestBody.email;
  const newPassword = requestBody.password;

  try {
    const userExists = await User.findOne({ email: email });
    console.log(userExists);
    if (userExists) {
      const isPasswordSame = await bcrypt.compare(
        newPassword,
        userExists.password
      );
      if (isPasswordSame) {
        response.status(404).json({
          message: `Old password and new password are same. So, can you enter different password.`,
        });
      } else {
        const salt = await bcrypt.genSalt(8);
        console.log(salt);
        const newEncryptedPassword = await bcrypt.hash(newPassword, salt);
        const _id = userExists._id;
        const updatedUserDetails = await User.findByIdAndUpdate(
          _id,
          { password: newEncryptedPassword },
          { new: true }
        );
        console.log(updatedUserDetails);
        response.status(200).json({
          message: "Password reset successfully.",
        });
      }
    } else {
      return response.status(404).send({
        message:
          "No account associated with given request for verification or link is invalid.",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
};

const deleteProfile  = async (request, response) => {
  const requestBody = request.body;
  const userId = requestBody.id;

  try {
    const isUserFound = await User.countDocuments({ _id: userId });
    console.log(isUserFound);
    if (isUserFound > 0) {
      console.log(mongoose.Types.ObjectId.isValid(userId));
      const isProfileDelete = await User.findByIdAndDelete( userId );
      console.log(isProfileDelete);
      if(isProfileDelete){
        response.status(200).json({
          message: "Your profile deleted successfully.",
        });
      }else{
        response.status(500).json({
          message: "Some error occurs at time of delete.",
        });
      }
    }
    else{
      response.status(401).json({
        message: "No user found to connected Id",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = {
  register,
  signin,
  signOut,
  verifyAccount,
  editProfile,
  resetPassword,
  resetPasswordCheck,
  changePassword,
  deleteProfile,
};
