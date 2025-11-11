import mongoose from "mongoose";

const LeadsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    wilaya: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
    status: {
      type: String,
      enum: ["new", "called", "canceled"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Lead = mongoose.models.Leads || mongoose.model("Leads", LeadsSchema);

export default Lead;
