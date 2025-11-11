import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duree: String,
});

const Course =
  mongoose.models.Courses || mongoose.model("Courses", CourseSchema);

export default Course;