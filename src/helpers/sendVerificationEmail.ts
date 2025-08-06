import { ApiResponse } from "@/types/ApiResponse.ts";
import VerificationEmail from "../../emails/VerificationEmail.tsx";
import { resend } from "../lib/resendEmail.ts";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Your PingMe Verification Code",
            react: VerificationEmail({username, otp: verifyCode}),
        });

        // console.log("Resend response data:", data);
        // console.log("Resend response error:", error);

        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending verification email\n:", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
