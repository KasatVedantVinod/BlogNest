const mongoose = require('mongoose');
const {createHmac, randomBytes} = require('crypto');
const {createTokenforUser}=require('../services/authentication');
const userSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      salt: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      profileImageURL: {
        type: String,
        default: '/images/avatar.webp',
      },
      role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
      },
    },
    {timestamps: true});

// What is salt?
/*In backend development, especially in user authentication, a salt is a random
 * string that is added to a password before hashing it. This process makes it
 * much harder for attackers to crack the password, even if they gain access to
 * the hashed passwords stored in your database*/
// If two users have the same password, their password hashes would normally be
// identical. But with salt, each password hash becomes unique, even if the
// passwords are the same

// Protects against rainbow table attacks (precomputed hash tables).
// ✔️ Makes each password hash unique.
// ✔️ Increases the time and effort required for brute force attacks.

userSchema.pre('save', function(next) {
  const user = this;  //This refers to the document being save in mongoose (database)
  if (!user.isModified('password')) return next();
  // Suppose you have not modified the password you have just modified you
  // profile picture So if you dont insert the above line then if it is the same
  // user then too its password will bhi hashed and new password will be
  // generated even though the password has not been changed

  const salt = randomBytes(16).toString();
  const hashedPassword =
      createHmac('sha256', salt).update(user.password).digest('hex');
  this.salt = salt;
  this.password = hashedPassword;
  // HEnce even if it is hacked the original password will not be stored in
  // databse
  next();
});
userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
  try {
    // Wait for the user to be found
    const user = await this.findOne({email});

    if (!user) throw new Error('User not found!');
    console.log(user)
    const salt = user.salt;
    const hashedPassword = user.password;

    // Hash the provided password using the stored salt
    const userProvidedHash =
        createHmac('sha256', salt).update(password).digest('hex');

    // Compare the hashed password
    if (hashedPassword !== userProvidedHash) {
      throw new Error('Incorrect Password!');
    }

    // Convert to plain object and remove sensitive fields
    // const userObj = user.toObject();
    // delete userObj.password;
    // delete userObj.salt;

    // return userObj;
    const token=createTokenforUser(user);
    return token;
  } catch (error) {
    console.log('Password match error:', error);
    throw error;  // rethrow the error to be handled in your route
  }
});
const User = mongoose.model('user', userSchema);
module.exports = User;
