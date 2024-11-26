import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 15,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: Number,
    },
    photo: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 3,
    },
    activeTransactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction",
      },
    ],
    prevTransactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
