import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  language: { type: String, default: 'en', enum: ['en', 'hi'] },
  profile: {
    stream: String,
    marks: Number,
    city: String,
    income: Number,
    category: { type: String, default: 'general' },
  },
  quizAnswers: [String],
  selectedCareer: String,
  createdAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', UserSchema)
