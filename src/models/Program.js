import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institutions" },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainers" },
    start_date: Date,
    end_date: Date,
    total_amount: Number,
    unpaid_amount: Number,
    paid_amount: Number,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Program =
  mongoose.models.Programs || mongoose.model("Programs", ProgramSchema);

export default Program;
