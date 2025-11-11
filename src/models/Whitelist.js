import mongoose from "mongoose";

const WhitelistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Programs" },
    status: { type: String, enum: ["new", "canceled"], default: "new" },
    note: String,
  },
  { timestamps: true }
);

const Whitelist =
  mongoose.models.Whitelist || mongoose.model("Whitelist", WhitelistSchema);

export default Whitelist;