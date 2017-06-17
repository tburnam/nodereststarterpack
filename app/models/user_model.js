import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  username: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

UserSchema.pre('save', function beforeyYourModelSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const model = this;
  if (model.isModified('password')) {
    const hash = bcrypt.hashSync(model.password, 10);
    model.password = hash;
  }
  return next();
});


//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
  const model = this;
  bcrypt.compare(candidatePassword, model.password, (err, res) => {
    if (err) {
      callback(true, null);
    } else {
      callback(null, (res === true));
    }
  });
};

// create PostModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
