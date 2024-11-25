import Together from 'together-ai';

export async function performOCR(imageBase64: string): Promise<string> {
  const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('Together AI API key is not configured');
  }

  const together = new Together({ apiKey });

  try {
    const response = await together.chat.completions.create({
      model: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
      messages: [
        {
          role: 'system',
          content: `You are a specialized bank statement OCR system. Extract information from the bank statement in a structured CSV format.

Required fields and format:
- date opération: Extract the operation date in DD/MM/YYYY format
- libellé: Extract the full transaction description
- date valeur: Extract the value date in DD/MM/YYYY format
- credit: Extract credit amount with 2 decimal places (if present)
- debit: Extract debit amount with 2 decimal places (if present)

Important formatting rules:
1. Format all dates as DD/MM/YYYY
2. Use dots for decimal places in amounts (e.g., 123.45)
3. Include all amounts with exactly 2 decimal places
4. Leave empty fields blank but keep the comma
5. Return data in CSV format with the exact headers: date opération,libellé,date valeur,credit,debit
6. Extract ALL transactions from the statement
7. Preserve the exact text of descriptions
8. Do not skip any transactions
9. Do not add any explanatory text - only return the CSV data`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'OCR processing failed');
  }
}