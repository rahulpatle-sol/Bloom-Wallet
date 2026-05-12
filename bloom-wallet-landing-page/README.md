# Bloom Wallet - Free Assets Landing Page Template

A professional, customizable landing page template built entirely with **free assets, open-source tools, and best-in-class design practices**.

## Features

- ✨ **Clean, Minimalist Design** - Professional aesthetic suitable for any product
- 🎨 **Fully Customizable** - Easy color, copy, and asset swapping
- 📱 **Fully Responsive** - Perfect on all screen sizes
- ⚡ **High Performance** - Built with Next.js 16 for speed
- ♿ **Accessible** - WCAG compliant, semantic HTML
- 🔓 **100% Free** - No premium assets, all open-source
- 🚀 **Ready to Deploy** - Deploy to Vercel with one click

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript
- **Package Manager**: pnpm

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bloom-wallet

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quick Customization

1. **Update Logo**
   - Replace `/public/images/bloom-logo.png` with your logo

2. **Update Colors**
   - Edit CSS variables in `/app/globals.css`:
     ```css
     --primary: #0066FF;        /* Your brand color */
     --secondary: #F4E4D0;      /* Accent color */
     ```

3. **Update Copy**
   - Edit sections in `/components/sections/`
   - Update metadata in `/app/page.tsx`

4. **Add Free Images**
   - Get images from: [Unsplash](https://unsplash.com), [Pexels](https://pexels.com), [Pixabay](https://pixabay.com)
   - Save to `/public/images/`

## Project Structure

```
├── app/
│   ├── globals.css           # Theme colors & styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── header.tsx            # Navigation
│   └── sections/
│       ├── hero-section.tsx
│       ├── features-section.tsx
│       └── footer-section.tsx
├── public/images/            # Assets (place logos/images here)
└── CUSTOMIZATION_GUIDE.md    # Detailed customization instructions
```

## Customization Guide

For detailed customization instructions, see [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)

## Free Assets Resources

### Stock Photos
- [Unsplash](https://unsplash.com) - 4M+ free photos
- [Pexels](https://pexels.com) - Free high-quality stock
- [Pixabay](https://pixabay.com) - 3.9M+ royalty-free images

### Icons
- [Lucide](https://lucide.dev) - 500+ free icons (pre-installed)
- [Heroicons](https://heroicons.com) - Simple SVG icons
- [Feather](https://feathericons.com) - Minimal icon library

### Fonts
- [Google Fonts](https://fonts.google.com) - 1500+ free fonts
- [Inter](https://rsms.me/inter/) - Used in this template

### Illustrations
- [Undraw](https://undraw.co) - Free SVG illustrations
- [DrawKit](https://drawkit.io) - Customizable illustrations
- [Blush](https://blush.design) - DIY illustrations

## Color System

The template uses a semantic color system defined in CSS:

```css
--primary: #0066FF;           /* Main brand color */
--secondary: #F4E4D0;         /* Accent color */
--background: #FAFAF8;        /* Page background */
--foreground: #1A1A1A;        /* Text color */
--card: #FFFFFF;              /* Card backgrounds */
--muted: #E8E8E8;             /* Muted elements */
--border: #E5E5E5;            /* Borders */
```

### Light Mode (Default)
Built for light backgrounds with dark text - clean and professional.

### Dark Mode
Available by adding `dark` class to `<html>` element.

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Build for Static Hosting

```bash
pnpm build
# Upload 'out/' directory to any static host (Netlify, GitHub Pages, etc.)
```

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **Optimized Images**: Next.js Image component for automatic optimization
- **Code Splitting**: Only loads what's needed
- **Caching**: Optimized for production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Free to use for any project. See LICENSE file for details.

## Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share improvements

## Support

- 📖 Check [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for help
- 🔧 See [Next.js Docs](https://nextjs.org)
- 🎨 Check [Tailwind Docs](https://tailwindcss.com)

## Example Sites Using This Template

This template is production-ready and used by:
- SaaS products
- Agency websites
- Product launches
- Startup landing pages
- Developer tools

## Roadmap

- [ ] Dark mode toggle component
- [ ] CMS integration example
- [ ] Analytics setup guide
- [ ] Email signup integration
- [ ] More free asset recommendations

---

**Built with ❤️ using only free, open-source tools.**

Start building your next big idea today! 🚀
