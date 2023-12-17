import { Document, Schema, model, Types, models, Model } from 'mongoose';

interface TransactionDocument extends Document {
    userId: Types.ObjectId;
    categoryId: Types.ObjectId;
    amount: number;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        categoryId: { type: Schema.Types.ObjectId, required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

const Transaction = models?.Transaction as Model<TransactionDocument> || model<TransactionDocument>('Transaction', transactionSchema);

export default Transaction