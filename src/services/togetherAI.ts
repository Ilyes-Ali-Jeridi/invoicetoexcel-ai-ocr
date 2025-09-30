import Together from "together-ai";

// Initialize Together AI client
const together = new Together({
  apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
});

/**
 * Performs OCR on a base64 encoded image using the Together AI API.
 * @param base64Image - The base64 encoded image data.
 * @returns A promise that resolves with the extracted text.
 */
export async function performOCR(base64Image: string): Promise<string> {
  try {
    const response = await together.chat.completions.create({
      model: "unum-cloud/llava-v1.6-mistral-7b-hf",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: "Extract all text from this image. present it as a csv file with the headers: date opération,libellé,date valeur,credit,debit",
            },
          ],
        },
      ],
    });

    // Extract the text content from the response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content found in OCR response");
    }

    // Clean up the response to get only the CSV part
    const csvContent = content.match(/```csv\n([\s\S]*?)\n```/);
    return csvContent ? csvContent[1].trim() : content.trim();
  } catch (error) {
    console.error("Error performing OCR with Together AI:", error);
    throw new Error("Failed to perform OCR. Please check your API key and network connection.");
  }
}