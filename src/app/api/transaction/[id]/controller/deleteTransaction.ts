import Transaction from '@/db/models/Transaction';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export default async function deleteTransaction(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const TransactionId = params.id;

        if (!mongoose.isValidObjectId(TransactionId))
            return NextResponse.json({ message: "Invalid id" }, { status: 400 })

        const existingTransaction = await Transaction.findById(TransactionId);

        if (!existingTransaction) {
            return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
        }

        await existingTransaction.deleteOne();

        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error in deleteTransaction:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
