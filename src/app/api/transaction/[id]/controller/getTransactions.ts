import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import db from '@/db/config';
import Transaction from '@/db/models/Transaction';

export default async function getTransactions(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userEmail = (await getServerSession(authOptions))?.user?.email ?? null;

        if (!userEmail) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 })
        }
        const categoryId = params.id;

        if (!mongoose.isValidObjectId(categoryId))
            return NextResponse.json({ message: "Invalid category id" })

        await db.connect()

        const transactions = await Transaction.find({ categoryId });

        await db.disconnect()
        return NextResponse.json({ transactions });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
