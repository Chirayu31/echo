import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import db from '@/db/config';
import User from '@/db/models/User';
import Transaction from '@/db/models/Transaction';

export default async function addTransaction(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const userEmail = (await getServerSession(authOptions))?.user?.email ?? null;

        if (!userEmail) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const categoryId = params.id;

        const { amount, description, date } = body;

        if (!mongoose.isValidObjectId(categoryId)) {
            return NextResponse.json({ message: 'Invalid category or user id' }, { status: 400 });
        }

        await db.connect();

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        const newExpense = new Transaction({
            userId: user._id,
            categoryId: categoryId,
            amount,
            description,
            date,
        });

        await newExpense.save();

        await db.disconnect();

        return NextResponse.json({ message: 'Expense added successfully', transaction: newExpense });
    } catch (error) {
        console.error('Error in postExpense:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
