import connectDB from "@/lib/connectDB.ts";
import { Message } from "@/model/Message.model.ts";
import userModel from "@/model/User.model.ts";



export async function POST(request: Request) {
    await connectDB();

    const { username, content } = await request.json()

    try {
        const user = await userModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        // Acceptance Check
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            );
        }
        // Craft Message
        const newMessage = {content, createdAt: new Date()}

        // Insert Into user object
        user.messages.push(newMessage as Message)
        // update user
        await user.save()

        return Response.json(
            {
                success: true,
                messages: "Message Sent Succesfully",
            },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Failed to send user a messsage: ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to send user a messsage",
            },
            { status: 500 }
        );
    }
}