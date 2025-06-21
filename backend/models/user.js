const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // 📘 Medical Profile
  age: Number,
  gender: String,
  dob: Date,
  contactNumber: String,
  bloodGroup: String,
  knownAllergies: [String],
  medicalConditions: [String],
  currentMedications: String,
  pastSurgeries: String,
  familyHistory: String,
  height: Number,
  weight: Number,
  insurance: String,
  emergencyContact: {
    name: String,
    phone: String,
  },
  lifestyle: {
    smoker: Boolean,
    alcohol: Boolean,
    exercise: String, // e.g., 'regular', 'moderate', 'none'
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔁 Auto-generate Patient ID (unchanged)
UserSchema.pre("save", async function (next) {
  if (this.isNew && !this.patientId) {
    const lastUser = await this.constructor.findOne().sort({ _id: -1 });

    let nextNumber = 1;
    if (lastUser && lastUser.patientId) {
      const lastNumber = parseInt(lastUser.patientId.replace("PAT", ""));
      nextNumber = lastNumber + 1;
    }

    this.patientId = `PAT${String(nextNumber).padStart(3, "0")}`;
  }

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
