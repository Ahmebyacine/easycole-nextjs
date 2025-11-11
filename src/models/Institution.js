import mongoose from "mongoose";

const InstitutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
});

const Institution =
  mongoose.models.Institutions ||
  mongoose.model("Institutions", InstitutionSchema);

export default Institution;
