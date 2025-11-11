import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Trainer =
  mongoose.models.Trainers || mongoose.model("Trainers", TrainerSchema);

export default Trainer;