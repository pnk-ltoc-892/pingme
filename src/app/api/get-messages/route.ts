import connectDB from "@/lib/connectDB.ts";
import userModel from "@/model/User.model.ts";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options.ts";
import mongoose from "mongoose";



export async function GET(request: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    // console.log(session);
    const user: User = session?.user as User;

    // User Not Logged In
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    // id:string -> mongoose Id : For mongoDB Aggregation Pipelines
    const userId = new mongoose.Types.ObjectId(user._id); 
    try {
        const user = await userModel.aggregate([
            {
                $match: {_id: userId}
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {"messages.createdAt": -1}
            },
            {
                $group: {_id: "$_id", messages: {$push: "$messages"}}
            }
        ]);
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages,
            },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Failed to get user messages: ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to get user messages",
            },
            { status: 500 }
        );
    }
}