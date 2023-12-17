import Category from "@/db/models/Category"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export default async function deleteCategory(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const categoryId = params.id

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: "Invalid Category" }, { status: 400 })
        }

        const existingCategory = await Category.findById(categoryId)

        if (!existingCategory)
            return NextResponse.json({ message: "Category Does not Found" }, { status: 404 })

        await existingCategory.deleteOne()

        return NextResponse.json({ message: "Category Deleted Successfully" })

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 })
    }


}