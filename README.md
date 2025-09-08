# JAB Martial Arts - School Website

**Version:** 1.9.0  
**Last Updated:** January 15, 2025  
**Status:** ✅ Production Ready  
**Repository:** [GitHub](https://github.com/nvgrigoryev24/jab-martial-arts)

This is a [Next.js](https://nextjs.org) project for JAB Martial Arts school website, featuring modern design, interactive elements, and comprehensive content management through PocketBase.

## 🚀 Latest Updates (v1.9.0)

### 🎁 New Promo Section for Kids
- **Full-Screen Background**: Beautiful background images with dark overlay for text readability
- **Dual Action Buttons**: "Contact Us" and "Support" buttons with JAB styling
- **PocketBase Integration**: Dynamic content management for promo section
- **Responsive Design**: Optimized for all devices with adaptive layouts
- **Scroll Animations**: Smooth fade-in animations on scroll
- **JAB Style Elements**: Red accents and decorative elements consistent with brand
- **Fallback Content**: Default content when PocketBase data is unavailable

### 📱 Mobile "Peek" Functionality
- **Interactive Card**: Mobile card slides up from bottom with smooth animations
- **Peek Animation**: Card subtly "peeks" out when section comes into focus
- **Bounce Indicators**: Animated arrow and hover effects to show interactivity
- **Dynamic Positioning**: Support for card_width and card_position from PocketBase
- **Mobile Transparency**: Enhanced background image visibility on mobile devices
- **Smooth Transitions**: 500ms ease-out animations for all interactions

## 🚀 Previous Updates (v1.8.0)

### 🏫 Dynamic "About School" Section
- **Complete PocketBase Integration**: Full dynamic content management for "About School" section
- **Flexible Card System**: Add unlimited cards with customizable content
- **Background Images**: Beautiful background photos with darkened overlays for text contrast
- **JAB Style Consistency**: All cards use unified JAB style (red borders)
- **Mobile Optimization**: Fixed overlay coverage issues on mobile devices

### 🎨 Enhanced Card Design
- **CSS Pseudo-elements**: Borders via `::after`, overlays via `::before` for perfect coverage
- **Optimized Composition**: Proper spacing and layout for better visual hierarchy
- **Rich Text Support**: HTML content from PocketBase rich text editor
- **Responsive Design**: Perfect display on all device sizes

### ❓ Dynamic FAQ System
- **Category-based Organization**: Questions grouped by topics with color-coded badges
- **Rich Text Answers**: HTML formatting support with proper paragraph spacing
- **Color Theme Integration**: Dynamic colors inherited from category themes
- **Russian Language Support**: Full support for Russian color theme names
- **Responsive Accordion**: Smooth expand/collapse animations

### 🔧 Technical Improvements
- **New PocketBase Collections**: `about_page`, `about_cards`, `faq`, and `faq_categories`
- **Updated TypeScript Interfaces**: Clean interfaces with proper expand relationships
- **Enhanced HTML Sanitization**: Improved `sanitizeHtmlForDisplay()` function
- **Z-index Optimization**: Proper layer hierarchy for overlays and content
- **CSS Prose Styling**: Tailwind prose classes for rich text formatting

### 📚 Documentation Updates
- **Updated PocketBase Setup Guide**: New collections and field configurations
- **Comprehensive Changelog**: Detailed version history and changes
- **Enhanced Project Guide**: Updated interfaces and feature descriptions
- **Mobile-First Documentation**: Focus on responsive design solutions

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
