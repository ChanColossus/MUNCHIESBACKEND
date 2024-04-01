const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');
const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transport

  const transporter = nodemailer.createTransport({
    //configure the email service
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, // or 465 or 587 or another Mailtrap port
    auth: {
      user: "fa59208cd93371",
      pass: "82bc14cd74667e",
    },
  });

  //compose the email message
  const mailOptions = {
    from: "munchiesandbevvies.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://192.168.0.143:8000/verify/${verificationToken}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

nodemailer;
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

exports.Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email was already registered" });
    }

    //create a new user
    const newUser = new User({ name, email, password });

    //genereate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    // console.log(newUser)
    await newUser.save();

    //send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "Registration Successfull" });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};
exports.Verify = async (req, res, next) => {
  try {
    const token = req.params.token;

    //Find the user with the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failed" });
  }
};
exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    if (!user.verified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, "gWlkpvmeYqas79948OiH");
    const name = user.name;
    const id = user._id;
    const role = user.role;

    res.status(200).json({ token, name, id, role });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
};

exports.userProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  // console.log(user)
  res.status(200).json({
    success: true,
    user,
  });
};

exports.getAllUser = async (req, res) => {
  try {
    const reviews = await User.find();
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    // Extract the order ID from the request parameters
    console.log(req.body)
    const { userId } = req.params;
    const {role} = req.body;

    console.log(role)
    // Find the order by ID
    const user = await User.findById(userId);

    // If the order is not found, return 404 Not Found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the status of the order to true
    user.role = role;

    // Save the updated order
    await user.save();

    // Return a success response
    return res.status(200).json({ message: 'Role  updated successfully', user });
  } catch (error) {
    console.error('Error updating role :', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log(req.params)
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.sendResetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Set reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    // Send reset password email
    const transporter = nodemailer.createTransport({
      //configure the email service
      host: "sandbox.smtp.mailtrap.io",
      port: 2525, // or 465 or 587 or another Mailtrap port
      auth: {
        user: "fa59208cd93371",
        pass: "82bc14cd74667e",
      },
    });
    const resetPasswordLink = `http://192.168.0.143/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: 'munchiesandbevvies.com',
      to: email,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
     This is your reset Token:\n\n
      ${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  console.log(req.body)
  try {
    const { token, password } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({ resetPasswordToken: token });

    // Check if the token is valid and not expired
    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Reset the user's password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
