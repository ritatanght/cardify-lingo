# Cardify Lingo
Cardify Lingo is a revamped version of the [Cardify](https://github.com/ritatanght/Cardify) application, focusing on language learning. Built with Next.js, Typescript, and TailwindCSS, this version introduces enhancements and modifications to the original application.

- [Live Demo](https://cardify-lingo.vercel.app/)

## Updates and Enhancements

- **Backend Migration:** The previous Express backend has been transformed into app/api routes using Next.js route handlers
- **New Features:**
  - Integration of Google account creation
  - Addition of a quiz mode for users to test their language proficiency
  - Implementation of speech recognition for the quiz in compatible browsers[^1]

### Database Changes

To maintain continuity with Cardify's database and ensure the service remains free, this application prefixes all tables (excluding the users table) with `lang_`.

### Font Optimization

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Google Font.

[^1]: The Web Speech API is predominantly supported by Google browsers. Chrome (desktop) offers the smoothest experience. For more information on supported browsers, please refer to the [repository](https://github.com/JamesBrill/react-speech-recognition) of react-speech-recognition.

## Screenshots

## Dependencies

- Node 20
- Next.js 14
- Next-Auth 4.x
- React 18
- React-dom 18
- React speech recognition
- React confetti
- React toastify
- React icons
- @headlessui/react
- pg
- Sass
- uuid
- Bcrypt
- Axios
- TailwindCSS 3
- Typescript 5

## Deployment

- **Hosting**: Vercel
- **Database**: Vercel Postgres

## Getting Started

1. Create `.env.local` based on `.env.local.example`
2. Install dependencies with `npm install`, then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
