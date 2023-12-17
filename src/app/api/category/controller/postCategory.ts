import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import db from "@/db/config";
import User from "@/db/models/User";
import Category from "@/db/models/Category";

export async function postCategory(req: NextRequest) {
    try {
        const userEmail = (await getServerSession(authOptions))?.user?.email ?? null;

        if (!userEmail) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 })
        }

        const body = await req.json();

        await db.connect()

        const user = await User.findOne({ email: userEmail })

        if (user) {
            const newCategory = new Category({
                userId: user._id, name: body.title, type: body.type
            });
            await newCategory.save();

            return NextResponse.json({ message: "New Category added", category: newCategory })
        }

        await db.disconnect()
        return NextResponse.json({ message: "User not found" }, { status: 404 })

    } catch (error) {

        await db.disconnect()
        return NextResponse.json({ message: "Internal Server error", error: error }, { status: 500 })
    }
}