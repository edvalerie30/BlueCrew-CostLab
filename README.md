# BlueCrew CostLab

AI-Powered Construction Estimating Platform for Blue Crew Construction

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) version 18 or higher
- npm (comes with Node.js)

### Local Development (Mac or PC)

```bash
# 1. Clone the repository
git clone https://github.com/edvalerie30/BlueCrew-CostLab.git
cd BlueCrew-CostLab

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` folder.

---

## Deployment Options

### Option 1: Static Hosting (Recommended)

BlueCrew CostLab is a static web app that can be hosted on:

#### Vercel (Easiest)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

#### Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect repository
4. Build command: `npm run build`
5. Publish directory: `dist`

#### Custom Domain (costlab.bluecrewco.com)
After deploying to Vercel/Netlify:
1. Add custom domain in dashboard
2. Add DNS records to bluecrewco.com:
   - CNAME: `costlab` → `your-deployment-url`

### Option 2: Self-Hosted

#### Using nginx
```nginx
server {
    listen 80;
    server_name costlab.bluecrewco.com;
    root /var/www/costlab/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Using Apache
```apache
<VirtualHost *:80>
    ServerName costlab.bluecrewco.com
    DocumentRoot /var/www/costlab/dist

    <Directory /var/www/costlab/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### Option 3: Docker

```bash
# Build image
docker build -t bluecrew-costlab .

# Run container
docker run -p 8080:80 bluecrew-costlab
```

---

## Features

- **Trade-Based Estimating**: 20 construction trade modules
- **Internal Pricing Database**: 200+ items from production estimates
- **Margin Protection**: Automatic warnings for low-margin trades
- **AI-Assisted Drafting**: Auto-populate from drawings (coming soon)
- **Human Approval Workflow**: All estimates require review
- **Parts Catalog**: Supplier data, part numbers, brands

## Project Structure

```
src/
├── components/          # React UI components
├── data/
│   ├── pricingDatabase.ts  # Internal pricing (from ESI Pool Estimator)
│   ├── partsCatalog.ts     # Parts with suppliers/part numbers
│   └── trades.ts           # Trade configurations
├── engine/
│   └── calculator.ts    # Estimate calculations
├── store/
│   └── estimateStore.ts # State management (Zustand)
├── types/
│   └── estimate.ts      # TypeScript definitions
└── utils/
    └── format.ts        # Formatting utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Security Notes

- All pricing data is internal (no external API calls)
- No client data leaves the browser in the current version
- For production: Add authentication before deploying publicly

---

**Blue Crew Construction**
1450 Greene St. Suite 221
Augusta, GA 30901
(762) 994-6083
