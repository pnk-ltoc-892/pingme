import { sendVerificationEmail } from "@/helpers/sendVerificationEmail.ts";
import connectDB from "@/lib/connectDB.ts";
import userModel from "@/model/User.model.ts";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await connectDB();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already Taken",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await userModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            // Verified User
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            }
            // User Not Verified - Again Overwrite Password & Try To Verify
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
            }
        } 
        else {
            // ! Creating new user if no existing user already exists
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }

        // ! Verification Email Logic
        const emailReponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailReponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailReponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    "User SignedUp successfully, Kindly verify your email",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error SigningUp User:", error);
        return Response.json(
            // Response Part
            {
                success: false,
                message: "Error SigningUp User",
            },
            // Status Code of Response
            { status: 500 }
        );
    }
}
