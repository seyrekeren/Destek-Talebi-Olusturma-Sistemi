const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//bura denenmedi hiç

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, company, department} = req.body;

    // Check if user already exists with this email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if role is provided
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      company,
      department
    });

    // Save the user to database
    const savedUser = await user.save();

    // Create a JWT token
    const token = jwt.sign({ userId: savedUser._id, role:savedUser.role }, process.env.JWT_SECRET);
    const userRole = user.role;

    // Send the response with token and user data
    res.status(201).json({ token, user: savedUser, userRole});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with this email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

    const userRole = user.role;
    // Send the response with token and user data
    res.json({ token, user, userRole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {registerUser, loginUser}