import { Schema, model } from 'mongoose';

const nameSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: [20, 'Can only be 20 charcters long'],
  },
  middleName: {
    type: String,
    maxLength: 10,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 15,
  },
});

export const userSchema = new Schema(
  {
    name: {
      type: nameSchema,
      require: true,
    },
    username: {
      type: String,
      required: [true, '*Username is required'],
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, '*Password is required'],
    },
    email: {
      type: String,
      required: [true, '*Email is required'],
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
      index: true,
    },
  },
  {
    timestamps: true,
    virtuals: {
      fullName: {
        get() {
          return `${this.name.firstName} ${
            this.name.middleName ? this.name.middleName + ' ' : ''
          }${this.name.lastName}`;
        },
        set(v) {
          const [firstName, middleName, lastName] = v.split(' ');
          this.name.firstName = firstName;
          if (lastName) {
            this.name.middleName = middleName;
          }
          this.name.lastName = lastName || middleName;
        },
      },
    },
    statics: {},
  }
);

export default model('User', userSchema);
