import connectDB from "@/lib/connectDB.ts";
import userModel from "@/model/User.model.ts";
import { usernameValidation } from "@/schemas/Validations.ts";
import z from "zod";


// Make a Query Schema
const usernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {

    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        // Get Query Schema
        const queryParam = {
            username: searchParams.get("username"),
        };
        // Validate Query Schema with zod
        const result = usernameQuerySchema.safeParse(queryParam);
        // console.log(result)   // Explore More
        if (!result.success) {
            const usernameErrors =
                result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        // username is valid - Check if unique
        const { username } = result.data;

        const existingVerifiedUser = await userModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "username is unique",
            },
            { status: 400 }
        );
    } 
    catch (error) {
        console.error("Error checking unique username: ", error);
        return Response.json(
            {
                success: false,
                meessage: "Error checking unique username",
            },
            { status: 500 }
        );
    }
}