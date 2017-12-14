import mongoose, {
  Schema
} from 'mongoose';
import bcrypt from 'bcryptjs';

// email: unique identifier
// fullname: could do first + last, but just one object for now
// password: gets hashed with bcryptjs
// classes: all classes that the user is participating in - careful how you populate this
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  fullname: String,
  password: String,
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', function beforeUserSave(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 8, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    return next();
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, result) => {
    if (error) {
      callback(error);
    } else {
      callback(null, result);
    }
  });
};

UserSchema.methods.getUser = function getUser() {
  return {
    username: this.username,
    fullname: this.fullname,
    classes: this.classes,
  };
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;