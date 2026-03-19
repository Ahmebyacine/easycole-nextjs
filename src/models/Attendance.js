import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    timestamp: { type: String, required: true },
    status: {
      type: String,
    },
  },
  { timestamps: true },
);

const Attendance =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
