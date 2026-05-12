# Free Assets Landing Page Template - Customization Guide

## Overview

This is a professional, minimalist SaaS landing page template built entirely with **free assets, open-source libraries, and customizable components**. It's designed to be easily adapted for any product launch or service offering.

## Key Features

✅ **Clean, Professional Design** - Minimalist aesthetic with excellent typography
✅ **Free Assets Only** - No premium icons, fonts, or paid tools required
✅ **Easy to Customize** - Simple color variables, swap logos/copy in minutes
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
✅ **High Performance** - Built with Next.js 16 and optimized for speed
✅ **Accessible** - WCAG compliant with semantic HTML and ARIA labels

## Getting Started

### 1. Update Your Branding

**Replace the logo:**
- Place your logo in `/public/images/your-logo.png`
- Update the reference in `components/header.tsx` and sections

**Update colors:**
- Edit `/app/globals.css` color variables:
  ```css
  :root {
    --primary: #0066FF;        /* Main brand color */
    --secondary: #F4E4D0;      /* Accent color */
    --background: #FAFAF8;     /* Light background */
    --foreground: #1A1A1A;     /* Text color */
  }
  ```

**Change the copy:**
- Hero section: `components/sections/hero-section.tsx`
- Features: `components/sections/features-section.tsx`
- Footer: `components/sections/footer-section.tsx`

### 2. Add Free Assets

All images should be **open-source and free to use**. Great sources:

**Stock Photos:**
- [Unsplash](https://unsplash.com) - Free, high-quality photos
- [Pexels](https://pexels.com) - Royalty-free stock images
- [Pixabay](https://pixabay.com) - Free images and videos

**Icons:**
- [Lucide Icons](https://lucide.dev) - Already integrated, 500+ free icons
- [Heroicons](https://heroicons.com) - Simple, elegant SVG icons
- [Feather Icons](https://feathericons.com) - Minimal icon set

**Fonts:**
- [Google Fonts](https://fonts.google.com) - Free, open-source fonts
- Already using: Inter (body) + system fonts

**Illustrations:**
- [Undraw](https://undraw.co) - Free SVG illustrations
- [DrawKit](https://drawkit.io) - Hand-drawn vector illustrations
- [Blush](https://blush.design) - Customizable illustrations

### 3. Customize Sections

#### Hero Section (`components/sections/hero-section.tsx`)
- Update headline and subheadline
- Change feature bullets (currently: No Seed Phrases, Decentralized Recovery, Living Will)
- Modify CTA button text and links
- Add/remove feature boxes

#### Features Section (`components/sections/features-section.tsx`)
- Edit the `features` array to match your product
- Each feature has: `icon`, `title`, `description`
- Use emoji for icons (or replace with Lucide icons)
- Adjust grid layout (currently 3 columns on desktop)

#### Footer Section (`components/sections/footer-section.tsx`)
- Update footer links in the `footerLinks` object
- Change social media links
- Add/remove columns as needed

### 4. Color Customization

The design uses CSS custom properties for theming. Update in `app/globals.css`:

```css
:root {
  --primary: #0066FF;           /* Primary brand color */
  --secondary: #F4E4D0;         /* Secondary/accent color */
  --background: #FAFAF8;        /* Page background */
  --foreground: #1A1A1A;        /* Text color */
  --card: #FFFFFF;              /* Card background */
  --muted: #E8E8E8;             /* Muted background */
  --border: #E5E5E5;            /* Border color */
}
```

**Dark mode** is also configured. Update the `.dark` selector for dark theme support.

### 5. Add Free Assets to Images

Place free-to-use images in `/public/images/`:

```
/public/images/
  ├── bloom-logo.png          # Your logo
  ├── hero-image.png          # Hero section image
  ├── feature-1.png           # Feature images
  └── ...
```

Example using Unsplash:
1. Find an image on [Unsplash](https://unsplash.com)
2. Download it
3. Save to `/public/images/`
4. Reference in components: `<img src="/images/filename.png" />`

### 6. Update Metadata

Edit `app/page.tsx` for SEO:

```typescript
export const metadata = {
  title: "Your Product - Tagline Here",
  description: "Your product description for search engines",
  openGraph: {
    title: "Your Product",
    description: "SEO-friendly description",
  },
};
```

### 7. Deploy Your Site

**Option 1: Deploy to Vercel (recommended)**
```bash
npm install -g vercel
vercel
```

**Option 2: Build for static hosting**
```bash
pnpm build
# Upload the `out/` directory to any static host
```

## File Structure

```
/app
  ├── globals.css              # Theme colors and styles
  ├── layout.tsx               # Root layout
  └── page.tsx                 # Home page

/components
  ├── header.tsx               # Navigation header
  └── /sections
      ├── hero-section.tsx     # Hero/landing section
      ├── features-section.tsx # Features/benefits
      └── footer-section.tsx   # Footer

/public/images
  └── *.png, *.jpg             # Asset files
```

## Free Tools Used

This template uses **only free, open-source tools**:

- **Next.js 16** - Free, open-source framework
- **React 19** - Free JavaScript library
- **Tailwind CSS v4** - Free utility-first CSS framework
- **Framer Motion** - Free animation library
- **Lucide Icons** - Free icon library
- **TypeScript** - Free, open-source language
- **pnpm** - Free package manager

## Best Practices

✅ **Keep it minimal** - White space and breathing room are your friends
✅ **Use consistent spacing** - Stick to Tailwind's spacing scale (4px, 8px, 12px, etc.)
✅ **Limit colors** - Use no more than 3-4 colors total
✅ **Readable fonts** - Keep body text at 14-16px minimum
✅ **Mobile-first** - Design for mobile, enhance for desktop
✅ **Performance** - Optimize images before uploading
✅ **Accessibility** - Use semantic HTML and alt text for images

## Common Customizations

### Change Hero Image
```typescript
// In hero-section.tsx
<img src="/images/your-hero.png" alt="Your product description" />
```

### Add a New Section
```typescript
// Create: components/sections/your-section.tsx
export function YourSection() {
  return (
    <section className="py-20 border-t border-border">
      {/* Your content */}
    </section>
  );
}

// Import in app/page.tsx
import { YourSection } from "@/components/sections/your-section";

// Add to main component
<YourSection />
```

### Change Button Style
```typescript
// Primary button
<a href="#" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
  Button Text
</a>

// Secondary button
<a href="#" className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg border border-border">
  Button Text
</a>
```

## Troubleshooting

**Images not showing?**
- Check file path: must be `/public/images/filename.png`
- Ensure image file exists
- Check browser console for errors

**Colors not updating?**
- Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
- Rebuild the project: `pnpm build`
- Check that changes are in `app/globals.css`

**Layout broken on mobile?**
- Check responsive classes: `md:`, `lg:`, `sm:`
- Test in browser dev tools (F12)
- Ensure padding/margins use Tailwind scale

## Next Steps

1. Fork or clone this repository
2. Replace logo with your own
3. Update colors and fonts
4. Write your copy
5. Add your free images
6. Deploy to Vercel or your hosting provider

## Support & Resources

- **Tailwind CSS Docs**: https://tailwindcss.com
- **Next.js Docs**: https://nextjs.org
- **Free Assets**: Unsplash, Pexels, Pixabay
- **Icons**: Lucide, Heroicons, Feather
- **Fonts**: Google Fonts

---

**Happy building! Remember: Great design doesn't require paid tools—just creativity and good fundamentals.** 🚀
