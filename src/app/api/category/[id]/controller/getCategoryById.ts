import db from "@/db/config"
import Category from "@/db/models/Category"
import Transaction from "@/db/models/Transaction"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export default async function getCategoryById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const categoryId = params.id

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: "Invalid Id" }, { status: 401 })
        }
        await db.connect()
        const category = await Category.findById(categoryId)
        const transactions = await Transaction.find({ categoryId });
        await db.disconnect()
        return NextResponse.json({ category, transactions })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }

}