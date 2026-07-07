# Design System - SMK Paramitha 2 Jakarta

## Overview
This document defines the visual design system for SMK Paramitha 2 Jakarta website, including colors, typography, components, and usage patterns.

---

## Color Palette

### Primary Colors

#### Red (Primary)
- **Main:** `#C0161C` (primary-600)
- **Light:** `#fee2e2` (primary-100)
- **Dark:** `#7f1d1d` (primary-900)
- **Usage:** CTA buttons, highlights, active states, important links

#### Navy Blue (Secondary)
- **Main:** `#1E1E8F` (secondary-900)
- **Light:** `#e0e7ff` (secondary-100)
- **Usage:** Headers, backgrounds, secondary elements, professional sections

#### Gold (Accent)
- **Main:** `#F5C400` (accent-500)
- **Light:** `#fef9c3` (accent-100)
- **Usage:** Badges, highlights, decorative elements, icons

### Neutral Colors

#### Backgrounds
- **White:** `#ffffff`
- **Surface:** `#F8F8FF` (light purple tint)
- **Light Gray:** `#F8F9FF` (contact page)
- **Dark:** `#0A0A1A` (text)

#### Text
- **Primary:** `#0A0A1A` (headings, important text)
- **Secondary:** `#6B7280` (body text, descriptions)
- **Muted:** `text-slate-500` (secondary information)

#### Borders
- **Default:** `border-slate-200`
- **Light:** `rgba(0,0,0,0.08)`
- **Accent:** `border-[#C0161C]/20`

### Gradients

#### Primary Gradient
```css
background: linear-gradient(135deg, #C0161C 0%, #1E1E8F 100%)
```
**Usage:** Hero sections, CTA backgrounds, major section headers

#### Secondary Gradient
```css
background: linear-gradient(to-r, #1E1E8F to #2D2DB8)
```
**Usage:** Subtle backgrounds, card overlays

#### Gold Accent
```css
background: linear-gradient(to-r, #C0161C to #F5C400)
```
**Usage:** Buttons, decorative elements

---

## Typography

### Font Families

#### Primary Font
- **Name:** Plus Jakarta Sans
- **Usage:** Body text, UI elements, general content
- **Import:** Google Fonts

#### Secondary Font
- **Name:** Space Grotesk
- **Usage:** Headings, display text
- **Import:** Google Fonts

### Font Sizes

#### Headings
- **H1 (Hero):** `text-4xl md:text-6xl lg:text-7xl` (36-72px)
- **H2 (Section):** `text-3xl md:text-4xl` (30-36px)
- **H3 (Card):** `text-2xl md:text-3xl` (24-30px)
- **H4 (Subsection):** `text-xl md:text-2xl` (20-24px)

#### Body Text
- **Large:** `text-lg` (18px) - descriptions, summaries
- **Base:** `text-base` (16px) - body content
- **Small:** `text-sm` (14px) - labels, secondary text
- **Tiny:** `text-xs` (12px) - captions, badges

### Font Weights
- **Bold:** `font-bold` (700) - headings, emphasis
- **Semibold:** `font-semibold` (600) - subheadings, important text
- **Medium:** `font-medium` (500) - labels, navigation
- **Normal:** `font-normal` (400) - body text
- **Light:** `font-light` (300) - hero descriptions

### Line Heights
- **Tight:** `leading-tight` (1.25) - headings
- **Normal:** `leading-relaxed` (1.625) - body text
- **Loose:** `leading-8` (2) - special cases

---

## Spacing System

### Container
- **Standard:** `container mx-auto px-4`
- **Narrow:** `max-w-4xl mx-auto`
- **Wide:** `max-w-6xl mx-auto`

### Section Padding
- **Small:** `py-12` (48px)
- **Medium:** `py-16` (64px)
- **Large:** `py-20` (80px)
- **XL:** `py-24` (96px)
- **XXL:** `py-32` (128px)

### Component Spacing
- **Gap XS:** `gap-2` (8px)
- **Gap SM:** `gap-4` (16px)
- **Gap MD:** `gap-6` (24px)
- **Gap LG:** `gap-8` (32px)
- **Gap XL:** `gap-12` (48px)

---

## Components

### Buttons

#### Primary Button
```jsx
<button className="bg-[#C0161C] text-white font-bold px-8 py-4 rounded-full hover:bg-[#a01217] transition-all shadow-lg">
  Button Text
</button>
```

#### Secondary Button
```jsx
<button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1E1E8F] rounded-full font-bold px-8 py-4 transition-all">
  Button Text
</button>
```

#### WhatsApp Button
```jsx
<button className="bg-[#25D366] text-white font-bold px-8 py-4 rounded-full hover:bg-[#20bd5a] transition-all shadow-xl">
  Chat WhatsApp
</button>
```

### Cards

#### Standard Card
```jsx
<div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#C0161C]/20">
  Card Content
</div>
```

#### Gradient Card
```jsx
<div className="bg-gradient-to-br from-[#F8F8FF] to-white p-8 rounded-2xl border border-slate-100 shadow-xl">
  Card Content
</div>
```

#### Jurusan Card
```jsx
<div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
     style={{
       background: `linear-gradient(135deg, ${warna_primer} 0%, ${warna_sekunder} 100%)`,
       boxShadow: `0 10px 30px -10px ${warna_primer}80`
     }}>
  Card Content
</div>
```

### Form Elements

#### Input Field
```jsx
<input
  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
  placeholder="Placeholder text"
/>
```

#### Textarea
```jsx
<textarea
  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all resize-none"
  rows="4"
  placeholder="Placeholder text"
/>
```

### Badges

#### Status Badge
```jsx
<span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-[#C0161C]">
  Status
</span>
```

#### Hero Badge
```jsx
<span className="inline-block py-2 px-4 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wider uppercase text-[#F5C400]">
  Badge Text
</span>
```

---

## Layout Patterns

### Hero Section
```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <Image src={heroImage} fill style={{ objectFit: 'cover' }} />
  </div>
  
  {/* Overlay Gradient */}
  <div className="absolute inset-0 z-10"
       style={{ background: 'linear-gradient(135deg, rgba(30,30,143,0.85) 0%, rgba(192,22,28,0.75) 100%)' }} />
  
  {/* Content */}
  <div className="w-full relative z-20 pt-20 text-center text-white">
    {/* Badge */}
    <span className="inline-block py-2 px-4 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm mb-6 text-sm font-semibold tracking-wider uppercase text-[#F5C400]">
      Badge
    </span>
    
    {/* Title */}
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
      Hero Title
    </h1>
    
    {/* Description */}
    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
      Hero description text
    </p>
    
    {/* CTAs */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/cta" className="px-8 py-4 bg-[#C0161C] hover:bg-[#a01217] text-white rounded-full font-bold transition-all">
        Primary CTA
      </Link>
      <Link href="/secondary" className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1E1E8F] rounded-full font-bold transition-all">
        Secondary CTA
      </Link>
    </div>
  </div>
</section>
```

### Section Header
```jsx
<div className="text-center mb-16">
  <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Section Title</h2>
  <div className="w-20 h-1 bg-[#C0161C] mx-auto rounded-full"></div>
</div>
```

### Grid Layouts

#### 3-Column Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

#### 2-Column Split
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div className="content-left">Left Content</div>
  <div className="content-right">Right Content</div>
</div>
```

---

## Animations

### Framer Motion Patterns

#### Fade In Up
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

#### Stagger Children
```jsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Scale on Hover
```jsx
<motion.div
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### CSS Animations

#### Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
}
```

#### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Icons

### Icon Library
- **Primary:** Lucide React
- **Usage:** Navigation, buttons, decorative elements

### Common Icons
- **Navigation:** `Menu`, `ChevronDown`, `ArrowRight`
- **Social:** `Instagram`, `Youtube`, `Facebook`, custom TikTok
- **Contact:** `MapPin`, `Phone`, `Mail`, `Clock`
- **UI:** `CheckCircle`, `Loader2`, `Upload`, `X`

### Icon Sizes
- **XS:** `size={14}` (14px)
- **SM:** `size={16}` (16px)
- **MD:** `size={18}` (18px)
- **LG:** `size={20}` (20px)
- **XL:** `size={24}` (24px)
- **XXL:** `size={32}` (32px)
- **XXXL:** `size={48}` (48px)

---

## Logo Usage

### Logo Specifications
- **Path:** `/images/logo.jpg`
- **Format:** JPG
- **Background:** Transparent preferred
- **Sizes:**
  - **Navbar:** 48x48px (w-12 h-12)
  - **Footer:** 64x64px (w-16 h-16)
  - **Hero:** 80x80px (w-20 h-20)

### Logo Variants
- **Light Background:** Standard logo
- **Dark Background:** Inverted version (if available)
- **Monochrome:** Single color for special cases

---

## Responsive Breakpoints

### Tailwind Breakpoints
- **Mobile:** `default` (< 640px)
- **Tablet:** `md` (640px - 768px)
- **Desktop:** `lg` (1024px - 1280px)
- **Large Desktop:** `xl` (1280px+)

### Responsive Patterns

#### Typography
```jsx
<h1 className="text-4xl md:text-6xl lg:text-7xl">
  Responsive Heading
</h1>
```

#### Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  Responsive Grid
</div>
```

#### Padding
```jsx
<section className="py-12 md:py-16 lg:py-20">
  Responsive Padding
</section>
```

---

## Shadows

### Shadow Scale
- **SM:** `shadow-sm` (subtle)
- **MD:** `shadow-md` (standard)
- **LG:** `shadow-lg` (elevated)
- **XL:** `shadow-xl` (floating)
- **2XL:** `shadow-2xl` (dramatic)

### Colored Shadows
```jsx
shadow-red-100      // Red tint
shadow-red-900/30   // Red with opacity
shadow-slate-200/50 // Slate with opacity
```

---

## Border Radius

### Scale
- **SM:** `rounded-lg` (8px)
- **MD:** `rounded-xl` (12px)
- **LG:** `rounded-2xl` (16px)
- **XL:** `rounded-3xl` (24px)
- **Full:** `rounded-full` (50%)

### Usage Patterns
- **Buttons:** `rounded-full`
- **Cards:** `rounded-2xl`
- **Inputs:** `rounded-xl`
- **Icons:** `rounded-full` or `rounded-lg`

---

## Accessibility

### Color Contrast
- **WCAG AA:** Minimum 4.5:1 for normal text
- **WCAG AAA:** Minimum 7:1 for large text
- **Verify:** Use contrast checker tools

### Focus States
```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-[#C0161C]/50">
  Accessible Button
</button>
```

### ARIA Labels
```jsx
<button aria-label="Close modal">
  <X size={20} />
</button>
```

---

## Brand Guidelines

### Voice & Tone
- **Professional:** Formal but approachable
- **Educational:** Clear and informative
- **Motivational:** Inspiring and encouraging

### Language
- **Primary:** Indonesian (Bahasa Indonesia)
- **Secondary:** English (for technical terms)

### Writing Style
- **Headings:** Title Case
- **Body:** Sentence case
- **CTAs:** Action-oriented (e.g., "Daftar Sekarang", "Selengkapnya")

---

## Image Guidelines

### Image Formats
- **Photos:** JPG (quality 80-90%)
- **Graphics:** PNG (transparent)
- **Icons:** SVG (scalable)

### Image Sizes
- **Hero Background:** 1920x1080px
- **Card Images:** 800x600px
- **Profile Photos:** 400x400px
- **Thumbnails:** 300x300px

### Alt Text
- **Descriptive:** Always include meaningful alt text
- **Decorative:** Use `alt=""` for decorative images
- **Context:** Consider the context of the image

---

## Code Examples

### Complete Page Structure
```jsx
import Head from 'next/head'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'

export default function PageName() {
  return (
    <Layout 
      title="Page Title — SMK Paramitha 2 Jakarta"
      description="Page description"
      keywords="relevant, keywords, here"
    >
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#C0161C] to-[#1E1E8F] text-white">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-center"
          >
            Page Title
          </motion.h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#F8F8FF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Section Title</h2>
            <div className="w-20 h-1 bg-[#C0161C] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cards */}
          </div>
        </div>
      </section>
    </Layout>
  )
}
```

---

## Maintenance

### Version Control
- **Document Version:** 1.0
- **Last Updated:** 2026
- **Maintainer:** Development Team

### Updates
- Review quarterly
- Update with new components
- Document breaking changes
- Maintain consistency

---

## Resources

### External Links
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion
- **Lucide Icons:** https://lucide.dev
- **Google Fonts:** https://fonts.google.com

### Internal Resources
- **Components:** `/components`
- **Pages:** `/pages`
- **Styles:** `tailwind.config.js`
- **Assets:** `/images`, `/assets`

---

## Notes

### Design Principles
1. **Consistency:** Use defined tokens consistently
2. **Accessibility:** Ensure WCAG compliance
3. **Performance:** Optimize images and animations
4. **Responsive:** Mobile-first approach
5. **Scalability:** Design for growth

### Common Mistakes to Avoid
- Hardcoding color values (use Tailwind classes)
- Skipping responsive breakpoints
- Ignoring accessibility
- Overusing animations
- Inconsistent spacing

---

*This design system is a living document and will evolve with the project.*
