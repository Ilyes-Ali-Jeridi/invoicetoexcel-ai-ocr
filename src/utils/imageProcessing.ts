import { performOCR } from '../services/togetherAI';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Represents a bank transaction with its details.
 */
export interface BankTransaction {
  dateOperation: string;
  libelle: string;
  dateValeur: string;
  credit: string;
  debit: string;
}

/**
 * Processes an image file by validating its size, reading it as a base64 string,
 * and sending it to the OCR service.
 * @param file - The image file to process.
 * @returns A promise that resolves with the cleaned OCR result as a CSV string.
 */
export async function processImage(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const ocrResult = await performOCR(base64Data);
        
        // Clean and validate the OCR result
        const cleanedResult = cleanOCRResult(ocrResult);
        if (!cleanedResult) {
          throw new Error('No valid data could be extracted from the image');
        }
        
        resolve(cleanedResult);
      } catch (error) {
        reject(new Error(error instanceof Error ? error.message : 'Failed to process image'));
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Cleans and formats the raw OCR text to ensure it is a valid CSV format.
 * It adds headers if missing, standardizes date and number formats, and handles invalid lines.
 * @param ocrText - The raw text extracted from the OCR process.
 * @returns A cleaned, CSV-formatted string.
 */
function cleanOCRResult(ocrText: string): string {
  // Split the text into lines and remove empty lines
  const lines = ocrText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return '';
  }

  // Ensure first line has correct headers
  const expectedHeaders = 'date opération,libellé,date valeur,credit,debit';
  if (!lines[0].toLowerCase().includes('date opération')) {
    lines.unshift(expectedHeaders);
  }

  // Process each data line
  const processedLines = lines.map((line, index) => {
    if (index === 0) {
      return expectedHeaders; // Ensure consistent header format
    }

    // Split the line into fields
    const fields = line.split(',').map(field => field.trim());
    if (fields.length < 5) {
      return null; // Skip invalid lines
    }

    // Process each field
    const processedFields = fields.map((field, fieldIndex) => {
      // Date fields (0 = date opération, 2 = date valeur)
      if (fieldIndex === 0 || fieldIndex === 2) {
        if (field.match(/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/)) {
          const [day, month, year] = field.split(/[/-]/).map(num => num.padStart(2, '0'));
          return `${day}/${month}/${year.length === 2 ? '20' + year : year}`;
        }
        return field;
      }
      
      // Amount fields (3 = credit, 4 = debit)
      if (fieldIndex === 3 || fieldIndex === 4) {
        if (field && field.match(/^-?\d+[.,]?\d*$/)) {
          return parseFloat(field.replace(',', '.')).toFixed(2);
        }
        return '';
      }
      
      // Description field
      if (fieldIndex === 1) {
        return field.replace(/"/g, '""'); // Escape quotes in description
      }
      
      return field;
    });

    return processedFields.join(',');
  }).filter(Boolean);

  return processedLines.join('\n') + '\n';
}