# Quick Start Guide - 5 Minutes to Your Custom Landing Page

## Step 1: Install & Run (1 minute)

```bash
cd /path/to/project
pnpm install
pnpm dev
```

Visit: http://localhost:3000

## Step 2: Replace Logo (1 minute)

1. Download your logo (PNG, JPG, or SVG)
2. Save as: `/public/images/your-logo.png`
3. Update in `components/header.tsx`:
   ```typescript
   <img src="/images/your-logo.png" alt="Your Company" />
   ```

## Step 3: Update Colors (1 minute)

Edit `/app/globals.css`:

```css
:root {
  --primary: #0066FF;        /* Change to your brand color */
  --secondary: #F4E4D0;      /* Change to your accent color */
}
```

Common brand colors:
- Tech Blue: `#0066FF`
- Startup Purple: `#7C3AED`
- Creative Pink: `#EC4899`
- Nature Green: `#10B981`

## Step 4: Update Copy (1 minute)

### Hero Section
Edit `components/sections/hero-section.tsx` around line 60:

```typescript
<h1>Your Headline Here</h1>
<p>Your subheadline and description</p>
```

### Features
Edit `components/sections/features-section.tsx` around line 69:

```typescript
const features = [
  {
    title: "Your Feature 1",
    description: "What it does...",
    icon: "🎯"
  },
  // ... more features
];
```

### Footer Links
Edit `components/sections/footer-section.tsx` around line 10:

```typescript
const footerLinks = {
  product: [
    { label: "Your Link", href: "#" },
    // ...
  ],
};
```

## Step 5: Add Free Images (1 minute)

1. **Get free images from:**
   - Unsplash.com (photography)
   - Undraw.co (illustrations)
   - Pixabay.com (stock photos)

2. **Save to:** `/public/images/your-image.png`

3. **Use in components:**
   ```typescript
   <img src="/images/your-image.png" alt="Description" />
   ```

## Deploy to Vercel (2 minutes)

```bash
npm install -g vercel
vercel
```

Follow the prompts and your site is live!

## Cheat Sheet

### Files to Edit
| File | What to Change |
|------|---|
| `components/header.tsx` | Logo, nav links |
| `app/globals.css` | Colors, fonts |
| `components/sections/hero-section.tsx` | Main headline, CTA |
| `components/sections/features-section.tsx` | Feature list |
| `components/sections/footer-section.tsx` | Footer links, social |
| `app/page.tsx` | Page title, meta description |

### Common Customizations

**Change button text:**
```typescript
<a href="#" className="bg-primary text-primary-foreground">
  Download Now
</a>
```

**Change section colors:**
```typescript
<section className="bg-secondary">  {/* Uses your accent color */}
  Content here
</section>
```

**Add new section:**
1. Create `components/sections/my-section.tsx`
2. Import in `app/page.tsx`: `import { MySection } from "@/components/sections/my-section";`
3. Add to page: `<MySection />`

**Change button style:**
- Primary (filled): `bg-primary text-primary-foreground`
- Secondary (outlined): `bg-secondary text-secondary-foreground border border-border`

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill existing process
pkill -f "next dev"
# Or use different port
pnpm dev --port 3001
```

### Images not showing?
- Check path: `/public/images/filename.png` (must start with `/`)
- Verify file exists
- Check browser console (F12) for errors

### Colors not changing?
- Edit `app/globals.css` (not Tailwind config)
- Clear browser cache: `Ctrl+Shift+Delete`
- Rebuild: `pnpm build`

### Build fails?
```bash
rm -rf .next
pnpm install
pnpm dev
```

## Free Resources

### Stock Photos
- [Unsplash](https://unsplash.com) - 4M+ free photos
- [Pexels](https://pexels.com) - High quality
- [Pixabay](https://pixabay.com) - Large collection

### Illustrations
- [Undraw](https://undraw.co) - Free SVG illustrations
- [DrawKit](https://drawkit.io) - Customizable vectors
- [Blush](https://blush.design) - DIY illustrations

### Icons
- [Lucide](https://lucide.dev) - Already installed (500+ icons)
- [Heroicons](https://heroicons.com) - Elegant SVG
- [Feather](https://feathericons.com) - Minimal set

### Fonts
- [Google Fonts](https://fonts.google.com) - 1500+ free fonts
- Already using: Inter (system font)

## Next Steps

1. ✅ Customize your brand
2. ✅ Update your copy
3. ✅ Add your images
4. ✅ Deploy to Vercel
5. 🎉 Share your landing page!

## Need Help?

- **Detailed guide**: See `CUSTOMIZATION_GUIDE.md`
- **Project info**: See `IMPLEMENTATION_SUMMARY.md`
- **Next.js help**: https://nextjs.org/docs
- **Tailwind help**: https://tailwindcss.com/docs

---

**That's it! You now have a professional landing page ready to customize.** 🚀

Built with free tools. Ready to deploy. Customize in minutes.
