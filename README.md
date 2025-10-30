# SpendGuard

A mindful spending app designed to help ADHD adults manage their finances through gamification, rewards, and AI-powered insights.

## Features

- 🎯 **Impulse Purchase Tracking** - Add items to your wishlist and track cooling-off periods
- 🧠 **ADHD Tax Tracker** - Monitor expenses related to ADHD challenges
- 🤖 **AI Chatbot Assistant** - Get personalized financial insights powered by Perplexity AI
- 🎮 **Gamification** - Earn points, badges, and maintain streaks for healthy financial habits
- 📊 **Spending Analytics** - Understand your spending patterns through comprehensive dashboards
- 🏆 **Rewards Hub** - Unlock achievements and track your progress

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI Integration**: 
  - Perplexity AI (Financial insights and chat)
  - Deepgram (Speech-to-text)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- API keys for Perplexity AI and Deepgram

### Installation

1. Clone the repository:
```bash
git clone https://github.com/somth9/SpendGuard.git
cd SpendGuard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`:
   - Get Firebase config from your Firebase project settings
   - Add your Perplexity API key from [perplexity.ai](https://www.perplexity.ai)
   - Add your Deepgram API key from [deepgram.com](https://www.deepgram.com)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

See `.env.example` for required environment variables. Make sure to never commit your actual `.env` file to version control.

### Required Firebase Config
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Required API Keys
- `PERPLEXITY_API_KEY` - For AI-powered financial insights
- `DEEPGRAM_API_KEY` - For speech-to-text functionality

## Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Firebase Storage
5. Copy your Firebase configuration to your `.env` file

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── onboarding/        # Onboarding flow
│   └── signin/            # Authentication pages
├── components/            # React components
│   ├── adhd-tax/         # ADHD Tax features
│   ├── auth/             # Authentication components
│   ├── chat/             # AI chat interface
│   ├── dashboard/        # Dashboard components
│   ├── impulse/          # Impulse purchase tracking
│   ├── layout/           # Layout components
│   ├── patterns/         # Spending patterns
│   ├── rewards/          # Rewards system
│   └── settings/         # Settings screen
├── lib/                   # Shared utilities
│   ├── contexts/         # React contexts
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
└── ...
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js. Make sure to set all required environment variables in your hosting platform's configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Private - All rights reserved

## Support

For support, please open an issue in the GitHub repository.

