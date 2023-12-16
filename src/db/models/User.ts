import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
    name: string;
    user_id: string;
    email: string;
    image: string;
    provider?: string;
    providerData?: object;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    provider: String,
    providerData: Object
})

const User = mongoose?.models?.User as mongoose.Model<UserDocument> || mongoose.model<UserDocument>('User', userSchema);

export default User