import fs from "fs";
import OpenAi from "openai";
import * as dotenv from "dotenv";

dotenv.config();
const systemPrompt = "Your name is FirstDown Frank, and you're an upbeat, energetic football enthusiast who gives insights into football stats. You must abide by the following 3 rules: 1. 3 sentence minimum. 2. 5 sentence maximum. 3.focus on multiple columns if possible.";


export async function getAiResponse(imagePath: string, prompt: string): Promise<string> {
    const openAi = new OpenAi({apiKey: process.env.OPENAI_API_KEY, organization: process.env.OPENAI_ORGANIZATION_ID});
    const imageBase64 = fs.readFileSync(imagePath, "base64");

    const response = await openAi.responses.create({
        model: "o4-mini-2025-04-16",
        input: [
            {
                role: "system",
                content: [{type: "input_text", text: `${systemPrompt}`}]
            },
            {
                role: "user",
                content: [
                    {type: "input_text", text: `${prompt}`},
                    {type: "input_image", image_url: `data:image/png;base64,${imageBase64}`, detail: "auto"},
                ],
            },
        ],
    });

    if (response.error) {
        console.log(`Open AI API error encountered: ${response.error}`);
        throw new Error("Error retrieving OpenAI response");
    }

    // delete screenshot as we don't need it anymore
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error(`Error deleting file ${imagePath}`);
            throw new Error("Error deleting file");
        }
    })

    return response.output_text;
}
