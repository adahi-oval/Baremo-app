import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  fullName: string;
  researcherId: number;
  email: string;
  password: string;
  institutes?: string[];
  role: 'admin' | 'user';
  comparePassword(password: string): Promise<boolean>;
}

// Se extiende la interfaz de Model<IUser> para poder mantener los métodos mongoose
export interface IUserMethods extends Model<IUser> {
  findByResearcherIdPrivate(researcherId: number): Promise<IUser | null>;
  findIdByResearcherId(researcherId: number): Promise<string | null>;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  researcherId: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
  institutes: { type: [String], default: [], maxlength: 2 }
}, {
  timestamps: true
});

userSchema.statics.findByResearcherIdPrivate = async function (researcherId: number): Promise<IUser | null> {
  return this.findOne({ researcherId: researcherId }).exec();
};

userSchema.statics.findIdByResearcherId = async function (researcherId: number): Promise<string | null> {
  const user = await this.findOne({ researcherId }, { _id: 1 }).lean();

  return user._id.toString();
}

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser, IUserMethods>('User', userSchema);
