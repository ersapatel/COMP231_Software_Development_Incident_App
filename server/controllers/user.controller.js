import Users from '../models/user.js';

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET User by id
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found'});
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
        const deteleUser = await Users.findByIdAndDelete(id);

        if (!deteleUser) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.json(deteleUser);
    } catch (err) {
        res.status(400).json( { error: err.message });
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

export default { getAllUsers, getUserById, createUser, updateUser, deleteUserById, deleteAllUsers }