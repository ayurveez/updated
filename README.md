
# Ayurveez - BAMS Learning Platform

Ayurveez is an AI-powered learning platform designed for BAMS (Bachelor of Ayurvedic Medicine and Surgery) students. It features course management, study scheduling, wellness resources, and AI companions (GuruJi & Sathi) powered by Google's Gemini API.

## Features

- **Courses**: Professional year-wise breakdown of subjects (1st, 2nd, 3rd Proff).
- **AI Chat**: 
  - **GuruJi**: General Ayurvedic queries.
  - **Sathi**: Personalized dashboard assistant for clinical doubts.
- **Study Scheduler**: AI-generated study routines based on student lifestyle.
- **Wellness Zone**: Ayurvedic tips for exam stress and anxiety.
- **Admin Dashboard**: Content management and Student Access Code generation.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ayurveez.git
    cd ayurveez
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
        - Create a `.env` file in the root directory or copy `.env.example`.
        - Add your Gemini API Key (recommended name):
            ```
            VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
            ```
            *(You can also use `VITE_API_KEY` as a fallback.) Note: Vite embeds `import.meta.env.*` at build time — if you change or add these values you must re-run `npm run build` and redeploy the generated `docs/` (or whatever your build output) for the changes to appear on the live site.*

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

This project can be easily deployed to Vercel, Netlify, or GitHub Pages.

## Credits

Created by **Dr. Ravi Shankar Sharma**
