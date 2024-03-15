import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 32,
    trim: true,
    unique: true,
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);
