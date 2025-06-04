import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  fullName: string;
  researcherId: number;
  email: string;
  password: string;
  institutes?: string[];
  comparePassword(password: string): Promise<boolean>;
}

// Se extiende la interfaz de Model<IUser> para poder mantener los métodos mongoose
export interface IUserMethods extends Model<IUser> {
  findByUsername(username: string): Promise<IUser | null>;
  findByUsernameAll(username: string): Promise<IUser | null>;
  findByResearcherIdPrivate(researcherId: number): Promise<IUser | null>;
  findIdByResearcherId(researcherId: number): Promise<string | null>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  researcherId: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  institutes: { type: [String], default: [], maxlength: 2 }
}, {
  timestamps: true
});

userSchema.statics.findByUsername = async function (username: string): Promise<IUser | null> {
  return this.findOne({ username: username }).select("-_id username fullname researcherId email institutes").exec();
};

userSchema.statics.findByUsernameAll = async function (username: string): Promise<IUser | null> {
  return this.findOne({ username: username }).exec();
};

userSchema.statics.findByResearcherIdPrivate = async function (researcherId: number): Promise<IUser | null> {
  return this.findOne({ researcherId: researcherId }).exec();
};

userSchema.statics.findIdByResearcherId = async function (researcherId: number): Promise<string | null> {
  return this.findOne({ researcherId: researcherId }).select("_id").exec();
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
