# NeverSmall Website

The official website for NeverSmall.com.au - Strategic Clarity for Builders.

## Overview

This is a Next.js 14 website built with TypeScript and Tailwind CSS, designed according to the NeverSmall brand standards defined in the MDC files.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Fonts:** Inter, Fraunces (serif), JetBrains Mono
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd site
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
site/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout with fonts and metadata
│       ├── page.tsx        # Home page
│       └── globals.css     # Global styles and Tailwind config
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Brand Guidelines

This website follows the NeverSmall brand standards defined in:

- `.cursor/rules/neversmall-os.mdc` - Core operating system
- `.cursor/rules/neversmall-brand-standards.mdc` - Visual identity
- `.cursor/rules/neversmall-narrative-standards.mdc` - Voice and tone

### Design Principles

1. **Clean Over Cluttered** - Generous whitespace, minimal decoration
2. **Confident, Not Loud** - Strong typography, restrained palette
3. **Quietly Premium** - High quality, thoughtful details
4. **Functional Aesthetics** - Beauty through utility

### Color Palette

- **Primary:** Black (#0a0a0a), White (#fafafa)
- **Gray Scale:** Full range for hierarchy
- **Accent:** Refined blue (#2563eb)

### Typography

- **Headings:** Fraunces (serif)
- **Body:** Inter (sans-serif)
- **Code:** JetBrains Mono

## Deployment

The site is designed to be deployed on Vercel or any Next.js-compatible hosting platform.

```bash
# Deploy to Vercel
vercel
```

## License

© NeverSmall. All rights reserved.

