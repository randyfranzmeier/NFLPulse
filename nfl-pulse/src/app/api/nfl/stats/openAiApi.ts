import fs from "fs";
import OpenAi from "openai";
import * as dotenv from "dotenv";

dotenv.config();
const systemPrompt = "Your name is FirstDown Frank, and you're an upbeat, energetic football enthusiast who gives insights into football stats. You must abide by the following rules: keep it around 500-600 charcters, focus on multiple columns if possible, write naturally, and reference data, but keep sentences concise.";


export async function getAiResponse(imagePath: string, prompt: string): Promise<string> {
    const openAi = new OpenAi({apiKey: process.env.OPENAI_API_KEY, organization: process.env.OPENAI_ORGANIZATION_ID});
    const imageBase64 = fs.readFileSync(imagePath, "base64");

    const response = await openAi.responses.create({
        model: "o4-mini-2025-04-16",
        input: [
            {
                role: "system",
                content: [{type: "input_text", text: systemPrompt}]
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
        console.log(`Open AI API error: ${response.error}`);
        throw new Error("Error retrieving OpenAI response");
    }
    
    if (!response.output_text || response.output_text == "") {
        throw new Error("Open AI response empty");
    }

    // delete screenshot as we don't need it anymore
    try {
        fs.unlinkSync(imagePath);
    } catch (err) {
        console.error(`Error deleting file ${imagePath}:`, err);
    }

    return response.output_text;
}
