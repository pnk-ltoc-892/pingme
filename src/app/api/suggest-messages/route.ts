// import { streamText } from "ai";
// import OpenAI from "openai";


// export const runtime = "edge"; // Required for streaming support on Vercel


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
// });


// export async function POST(req: Request): Promise<Response> {
//     try {
//         const systemPrompt: string =
//             "Create a list of three open-ended and engaging questions formatted as a single string. " +
//             "Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, " +
//             "and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes " +
//             "that encourage friendly interaction. For example, your output should be structured like this: " +
//             "'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||" +
//             "What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute " +
//             "to a positive and welcoming conversational environment.";

//         // ! Ignoring some error here
//         const result = await streamText({
//             // @ts-ignore
//             model: async (input: PromptFnArgs) => {
//                 return await openai.chat.completions.create({
//                     model: "gpt-3.5-turbo",
//                     messages: input.messages,
//                     stream: true,
//                 });
//             },
//             messages: [
//                 {
//                     role: "system",
//                     content: systemPrompt,
//                 },
//             ],
//         });

//         return result.toTextStreamResponse();
//     } 
//     catch (error: unknown) {
//         console.error("Unexpected error:", error);

//         if (error instanceof OpenAI.APIError) {
//             const { name, status, headers, message } = error;
//             return Response.json(
//                 {
//                     name,
//                     status,
//                     headers: Object.fromEntries(headers.entries()),
//                     message,
//                 },
//                 { status }
//             );
//         }

//         return Response.json(
//             {
//                 error: "Internal Server Error",
//                 message: error instanceof Error ? error.message : String(error),
//             },
//             { status: 500 }
//         );
//     }
// }
