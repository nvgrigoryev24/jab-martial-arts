# JAB Martial Arts - School Website

**Version:** 1.3.0  
**Last Updated:** January 15, 2025  
**Status:** ✅ Production Ready  
**Repository:** [GitHub](https://github.com/nvgrigoryev24/jab-martial-arts)

This is a [Next.js](https://nextjs.org) project for JAB Martial Arts school website, featuring modern design, interactive elements, and comprehensive content management through PocketBase.

## 🚀 Latest Updates (v1.3.0)

### 🎨 Dynamic Hero Section & Enhanced UI
- **Dynamic Hero Content**: Complete Hero section content now loads from PocketBase
- **Image Integration**: Proper image handling with fallback to placeholder
- **Enhanced Hover Effects**: Beautiful interactive hover animations for Hero images
- **Static Colors**: Colors remain static while content is fully dynamic

### 🎨 Schedule Color Theme System
- Dynamic color themes for training locations and levels via PocketBase
- Customizable transparency settings (0-100%) with inline styles
- Fallback system for backward compatibility
- Integration with `color_theme` collection

### 🏋️ Enhanced Training Schedule
- Support for multiple coaches per training session
- Improved filtering by locations and levels using real PocketBase data
- Dynamic level detection from actual schedule data
- Clean console without debug messages

### 🔧 Technical Improvements
- Updated TypeScript interfaces for new collections
- Enhanced PocketBase integration with proper expand parameters
- Improved error handling for hot reload scenarios
- Optimized data fetching and state management
- GitHub integration and repository setup

### 📚 Documentation Updates
- Updated PocketBase collection setup guide
- Added color theme examples for schedule
- Enhanced technical documentation
- Comprehensive backup system
- GitHub repository documentation

## 🐙 GitHub Repository

This project is now available on GitHub: [jab-martial-arts](https://github.com/nvgrigoryev24/jab-martial-arts)

### Repository Features
- **Public Repository**: Open source and accessible to everyone
- **Complete Documentation**: Comprehensive guides and setup instructions
- **Version Control**: Full git history with detailed commit messages
- **Issue Tracking**: GitHub Issues for bug reports and feature requests
- **Collaboration**: Ready for team development and contributions

### Clone and Setup
```bash
# Clone the repository
git clone https://github.com/nvgrigoryev24/jab-martial-arts.git

# Navigate to project directory
cd jab-martial-arts

# Install dependencies
npm install

# Start development server
npm run dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
