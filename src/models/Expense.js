import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Programs" },
    amount: { type: Number, default: 0 },
    note: String,
  },
  { timestamps: true }
);

const Expense =
  mongoose.models.Expenses || mongoose.model("Expenses", ExpenseSchema);

export default Expense;
