import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UsersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

UsersSchema.pre('save', async function (next) {
  try {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;  
  const hashed = await bcrypt.hash(this.password, saltRounds);
  this.password = hashed;
  next();
}  catch (err) {
    next(err);
  }
});

UsersSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const Users = mongoose.model('Users', UsersSchema);

export default Users;