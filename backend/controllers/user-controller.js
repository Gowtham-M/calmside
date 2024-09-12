const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

// Middleware for authentication and role-based authorization
exports.authMiddleware = (roles = []) => {
  return (req, res, next) => {
    // Check if roles is an array, if not, convert it into one
    if (typeof roles === "string") {
      roles = [roles];
    }

    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Check if the user's role is allowed to access this route
      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Access forbidden: Insufficient privileges" });
      }

      // Store the decoded user in the request object
      req.user = decoded;
      next();
    });
  };
};

// Superuser setup (to be called from Postman initially)
exports.addSuperUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password, role: "superuser" });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add company admin
exports.addCompanyAdmin = async (req, res) => {
  try {
    const { name, username, password, company, phonenumber } = req.body;
    const user = new User({
      name,
      username,
      password,
      role: "admin",
      company,
      phonenumber,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user });
  } catch (err) {
    console.log(`error ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Middleware to authenticate and authorize based on role
exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.isSuperUser = (req, res, next) => {
  if (req.user.role !== "superuser") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

exports.isCompanyAdmin = (req, res, next) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin", company: req.params.id });
    res.json(admins);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateAdmins = async (req, res, next) => {
  try {
    const admin = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(admin);
  } catch (err) {
    res.status(500).send(err);
  }
};
