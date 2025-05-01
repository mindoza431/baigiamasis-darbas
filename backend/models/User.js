const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      console.log('Užšifruojamas slaptažodis');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      console.log('Slaptažodis užšifruotas');
    }
    next();
  } catch (error) {
    console.error('Slaptažodžio užšifravimo klaida:', error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Palyginami slaptažodžiai');
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Palyginimo rezultatas:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Slaptažodžio palyginimo klaida:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema); 