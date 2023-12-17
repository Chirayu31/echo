import mongoose, { Document, Schema, model, Types, models } from 'mongoose';

interface CategoryDocument extends Document {
    userId: Types.ObjectId;
    name: string;
    type: 'income' | 'expense' | 'saving';
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        type: { type: String, enum: ['income', 'expense', 'saving'], required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

const Category = models?.Category as mongoose.Model<CategoryDocument> || model<CategoryDocument>('Category', categorySchema);

export default Category;