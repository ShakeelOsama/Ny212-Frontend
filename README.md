# NY 212 Pizza - Static Site Generation (SSG) Implementation

This is a Next.js 15 pizza delivery website for "NY 212 Pizza" with Static Site Generation (SSG) for optimal performance.

## 🚀 Features

- **Static Site Generation (SSG)**: Pages are pre-rendered at build time for maximum performance
- **Hybrid Rendering**: Static data with client-side interactivity
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Search**: Debounced search functionality
- **Category Navigation**: Horizontal carousel with sticky behavior
- **Product Details**: Modal dialogs with quantity selection
- **Image Optimization**: Next.js Image component with WebP support

## 🏗️ Architecture

### SSG Implementation

The application uses a hybrid approach:

1. **Server Component** (`app/page.js`): Fetches data at build time
2. **Client Component** (`HomePageClient`): Handles all interactivity
3. **Static Data**: Pre-rendered at build time for instant loading
4. **Dynamic Updates**: Periodic data refresh (every 5 minutes) to keep content fresh

### Data Flow

```
Build Time:
├── getStaticData() → Fetches products & categories
├── Data transformation → Converts Strapi format
├── Static HTML generation → Pre-rendered pages
└── Client hydration → Interactive features

Runtime:
├── Initial load → Static content (instant)
├── Client hydration → Search, navigation, modals
└── Periodic refresh → Keep data fresh
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build (SSG)

```bash
# Standard build with SSG
npm run build

# Production build with SSG
npm run build:ssg

# Start production server
npm run start
```

## 📁 Project Structure

```
project/
├── app/
│   ├── components/         # React components
│   │   ├── CategoryCarousel.js
│   │   ├── FoodCard.js
│   │   ├── GroupedProductSections.js
│   │   ├── ProductDetail.js
│   │   ├── SearchBar.js
│   │   └── Footer.js
│   ├── hooks/             # Custom React hooks
│   ├── layout.js          # Root layout with metadata
│   └── page.js            # Main page with SSG
├── data/
│   └── fetchData.js       # Data fetching utilities
├── lib/
│   ├── api.js            # API utilities
│   └── utils.js          # Helper functions
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://wise-book-dea9d4bff7.strapiapp.com
```

### Next.js Config

- **Static Generation**: Enabled with hybrid approach
- **Image Optimization**: WebP support with remote patterns
- **Performance**: SWC minification and compression enabled

## 📊 Performance Optimizations

### SSG Benefits

- **Instant Loading**: Pre-rendered HTML served immediately
- **Better SEO**: Search engines can crawl static content
- **Reduced Server Load**: Static files served from CDN
- **Improved Core Web Vitals**: Better LCP, FID, and CLS scores

### Caching Strategy

- **Build Time**: Data cached for 1 hour during build
- **Runtime**: Periodic refresh every 5 minutes
- **Images**: 1-week minimum cache TTL
- **Static Assets**: Long-term caching

### Bundle Optimization

- **Code Splitting**: Automatic with Next.js
- **Tree Shaking**: Unused code eliminated
- **Minification**: SWC for faster builds
- **Compression**: Gzip/Brotli enabled

## 🎨 Design System

- **Primary Color**: `#c1272d` (NY 212 red)
- **Typography**: Geist Sans font
- **Framework**: Tailwind CSS v4
- **Components**: Radix UI for accessibility

## 🔄 Data Management

### Static Data Generation

```javascript
// Runs at build time
async function getStaticData() {
  const [products, categories] = await Promise.all([
    fetchData(),
    fetchCategories()
  ]);
  
  return {
    products: transformProducts(products),
    categories: transformCategories(categories),
    groupedProducts: groupByCategory(products)
  };
}
```

### Client-side Updates

```javascript
// Runs in browser for fresh data
useEffect(() => {
  const refreshData = async () => {
    // Fetch fresh data every 5 minutes
  };
  
  const interval = setInterval(refreshData, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod
```

### Static Export (Alternative)

```bash
# Build and export static files
npm run export
```

### Other Platforms

The SSG implementation works with any static hosting platform:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any CDN

## 📈 Performance Metrics

With SSG implementation:

- **First Contentful Paint (FCP)**: < 1s
- **Largest Contentful Paint (LCP)**: < 2s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## 🔧 Troubleshooting

### Build Issues

1. **API Connection**: Ensure `NEXT_PUBLIC_API_URL` is accessible
2. **Memory**: Large datasets may require increased Node.js memory
3. **Timeouts**: API calls may timeout during build

### Runtime Issues

1. **Hydration Mismatch**: Ensure server/client data consistency
2. **Image Loading**: Check remote patterns in `next.config.js`
3. **Search Functionality**: Verify client-side JavaScript is loaded

## 📝 License

This project is private and proprietary.

---

**Built with Next.js 15 and Static Site Generation for optimal performance.**
