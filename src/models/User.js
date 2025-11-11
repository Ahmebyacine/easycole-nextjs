import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    institutions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Institutions" }],
    role: {
      type: String,
      enum: ["employee", "manager", "member", "admin"],
      default: "employee",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.Users || mongoose.model("Users", UserSchema);

export default User;