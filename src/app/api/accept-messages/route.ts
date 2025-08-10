import connectDB from "@/lib/connectDB.ts";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options.ts";
import userModel from "@/model/User.model.ts";

export async function POST(request: Request) {
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

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found to update status to accept messages",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Failed to update user status to accept messages: ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            { status: 500 }
        );
    }
}


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

    const userId = user._id;
    try {
        const userFound = await userModel.findById(userId);
        if (!userFound) {
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: userFound.isAcceptingMessage,
            },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Failed to get user status to accept messages: ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to get user status to accept messages",
            },
            { status: 500 }
        );
    }
}
