# AI Invoice Scanner

The AI Invoice Scanner is a web-based application that leverages AI-powered Optical Character Recognition (OCR) to extract tabular data from invoice images and convert it into a downloadable CSV file. This tool is designed to streamline the process of digitizing paper invoices, making data entry faster and more accurate.

## Key Features

- **Drag-and-Drop Interface**: Easily upload multiple invoice images at once.
- **AI-Powered OCR**: Utilizes the Together AI API for high-accuracy text extraction.
- **CSV Export**: Converts extracted data into a clean, ready-to-use CSV format.
- **Error Handling**: Provides clear feedback on processing errors and file-specific issues.
- **Responsive Design**: Works smoothly on various screen sizes.

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Service**: Together AI
- **UI Components**: `lucide-react` for icons, `react-dropzone` for file handling

## Setup and Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-image-converter.git
   cd ai-image-converter
   ```

2. **Install dependencies**:
   Make sure you have Node.js and npm installed.
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root of the project and add your Together AI API key:
   ```
   VITE_TOGETHER_API_KEY=your_together_ai_api_key
   ```
   You can obtain an API key from the [Together AI website](https://api.together.ai/).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Project Structure

```
.
├── public/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── ConversionProgress.tsx
│   │   ├── Dropzone.tsx
│   │   └── ErrorDisplay.tsx
│   ├── services/         # Modules for external services (e.g., AI APIs)
│   │   └── togetherAI.ts
│   ├── utils/            # Utility functions
│   │   └── imageProcessing.ts
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Entry point of the React application
│   └── index.css         # Global styles
├── .env.local            # Environment variables (not committed)
├── package.json
└── README.md
```

- **`src/components`**: Contains modular UI components like the file dropzone, progress bar, and error display.
- **`src/services`**: Handles communication with the Together AI API. The `togetherAI.ts` file contains the `performOCR` function that sends images for processing.
- **`src/utils`**: Includes helper functions, such as `imageProcessing.ts`, which manages file validation, reading, and cleaning the OCR results.
- **`src/App.tsx`**: The core component that ties everything together, managing state and user interactions.