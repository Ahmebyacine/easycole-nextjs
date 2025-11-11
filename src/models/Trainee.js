import mongoose from "mongoose";

const TraineeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Programs" },
    inialTranche: { type: Number, default: 0 },
    methodePaiement1: { type: String, default: "" },
    methodePaiement2: { type: String, default: "" },
    secondTranche: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    rest: Number,
    totalPrice: Number,
    note: String,
  },
  { timestamps: true }
);

const Trainee =
  mongoose.models.Trainees || mongoose.model("Trainees", TraineeSchema);

export default Trainee;