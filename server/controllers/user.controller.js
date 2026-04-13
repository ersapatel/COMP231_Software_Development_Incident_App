import Users from '../models/user.js';
import bcrypt from 'bcrypt';

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET User by id
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create new user
const createUser = async (req, res) => {
 try {

  const newUser = new Users(req.body);

  const savedUser = await newUser.save();

  res.status(201).json(savedUser);

 } catch (err) {
  res.status(400).json({ error: err.message });
 }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };

        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        console.log("REQ BODY:", req.body);
        console.log("BEFORE HASH:", updateData.password);
        console.log("AFTER HASH:", updateData.password);

        const updatedUser = await Users.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
};

//Delete user by id
const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await Users.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Delete all users
const deleteAllUsers = async (req, res) => {
    try {
        const deteleAllUsers = await Users.deleteMany({});

        res.json(deteleAllUsers);
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
};

// Find user Id By email
const findUserIdByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({email});

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        res.json({id: user._id});
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
}

export default { getAllUsers, getUserById, createUser, updateUser, deleteUserById, deleteAllUsers, findUserIdByEmail }