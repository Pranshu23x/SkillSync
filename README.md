# SkillSync ⚡

An AI-powered internship recommendation engine designed for the PM Internship Scheme. SkillSync helps students find the perfect internship matches by analyzing their resumes and skills, providing personalized recommendations and career guidance.

## Features

### 🎯 Smart Resume Analysis
- **PDF Resume Upload**: Drag-and-drop or browse to upload PDF resumes
- **AI-Powered Analysis**: Uses Google's Gemini AI to analyze resume content
- **Comprehensive Feedback**: Provides overall rating, strengths, weaknesses, and improvement suggestions

### 🔍 Intelligent Internship Matching
- **Skill-Based Matching**: Matches user skills with internship requirements
- **Percentage-Based Scoring**: Shows match percentage for each internship
- **Detailed Recommendations**: Lists matched skills vs. required skills for transparency

### 📊 Career Guidance
- **Skills Gap Analysis**: Identifies skills to learn for better opportunities
- **Market Demand Insights**: Shows how many internships require specific skills
- **Personalized Learning Path**: Suggests high-impact skills to focus on

### 🌐 Multilingual Support
- **English and Hindi**: Full interface translation
- **Localized Content**: Culturally appropriate messaging and guidance

### 📱 Modern User Experience
- **Glass Morphism Design**: Beautiful, modern UI with backdrop blur effects
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Interactive Elements**: Smooth animations and hover effects

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### AI Integration
- **Google Gemini AI** for resume analysis and feedback
- **PDF.js** for PDF text extraction

### Data Management
- JSON-based internship database
- Client-side matching algorithms

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EmptyState.tsx   # Empty state displays
│   ├── Header.tsx       # Main header component
│   ├── InternshipCard.tsx # Individual internship display
│   ├── LanguageSwitcher.tsx # Language selection
│   ├── LoadingSpinner.tsx # Loading indicators
│   ├── SkillSuggestions.tsx # Skills recommendation display
│   └── UserProfileForm.tsx # User input form
├── hooks/               # Custom React hooks
│   └── useInternships.ts # Internship data management
├── types/              # TypeScript type definitions
│   └── Internship.ts   # Core data types
├── utils/              # Utility functions
│   └── matchingEngine.ts # Skill matching algorithms
├── translations.ts     # Multi-language support
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/skillsync.git
cd skillsync
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Configuration

### Internship Data
Internship data is stored in `public/thing.json`. Each internship entry includes:
- `id`: Unique identifier
- `title`: Job title
- `company`: Company name
- `location`: Job location
- `skills_required`: Array of required skills
- `score_range`: Difficulty range [min, max]
- `category`: Job category
- `description`: Job description

### AI Configuration
The application uses Google's Gemini AI API. Configure your API key in the environment variables or update the hardcoded key in `App.tsx` (not recommended for production).

## How It Works

### Resume Analysis Process
1. **PDF Upload**: User uploads PDF resume via drag-and-drop or file browser
2. **Text Extraction**: PDF.js extracts text content from the PDF
3. **AI Analysis**: Gemini AI analyzes the resume text and provides structured feedback
4. **Results Display**: Shows rating, strengths, weaknesses, and suggestions

### Matching Algorithm
1. **Skill Extraction**: Identifies user skills from resume or profile
2. **Skill Matching**: Compares user skills with internship requirements
3. **Score Calculation**: Calculates match percentage and counts
4. **Ranking**: Sorts internships by match count and percentage
5. **Recommendations**: Displays top matches with detailed breakdowns

### Skills Suggestion Engine
1. **Gap Analysis**: Identifies skills user doesn't have
2. **Market Analysis**: Counts how many internships require each skill
3. **Prioritization**: Ranks skills by market demand
4. **Presentation**: Shows top skills with opportunity counts

## API Integration

### Gemini AI Integration
The application integrates with Google's Gemini AI using the REST API:
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Authentication**: API key-based
- **Response Format**: Structured JSON with analysis results

## Customization

### Adding New Internships
Update `public/thing.json` with new internship entries following the existing schema.

### Modifying Matching Logic
Edit `src/utils/matchingEngine.ts` to adjust the matching algorithm:
- Change skill matching criteria
- Modify scoring weights
- Add new ranking factors

### Updating AI Prompts
Modify the prompt in `App.tsx` `sendToGemini` function to adjust AI analysis focus.

### Language Support
Add new languages in `src/translations.ts`:
1. Define new language code
2. Add translations for all keys
3. Update the language switcher component

## Performance Considerations

- **Client-Side Processing**: All matching happens client-side for privacy and speed
- **Lazy Loading**: Components and data are loaded on demand
- **Optimized Rendering**: React optimizations prevent unnecessary re-renders
- **CDN Assets**: External libraries loaded from CDN for faster loading

## Security Notes

- **API Key Exposure**: The Gemini API key is currently exposed in client-side code. For production, implement a backend proxy
- **File Upload**: PDF processing happens client-side, ensuring resume privacy
- **No Data Storage**: No user data is stored on servers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **CodexCrew Team** - Development team behind SkillSync
- **Google Gemini AI** - AI-powered resume analysis
- **PM Internship Scheme** - The program this tool is designed to support

## Support

For support and questions, visit our [Credits Page](https://credits-seven.vercel.app/) or contact the development team.

---

Built with ❤️ by [CodexCrew](https://credits-seven.vercel.app/)
