# AbaMade Footwear E-commerce Platform

This is a full-stack e-commerce platform for AbaMade footwear, featuring a customer-facing storefront and an admin dashboard.

## Database Setup

### 1. Set up environment variables

Create a `.env.local` file in the root of your project with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 2. Create database schema

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of `lib/supabase/schema.sql`
4. Run the SQL script to create all tables and set up relationships

### 3. Seed the database (optional)

To populate the database with sample data:

\`\`\`bash
# Install ts-node if you don't have it
npm install -g ts-node

# Run the seed script
ts-node lib/db/seed.ts
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Customer-facing storefront**
  - Product browsing and filtering
  - User authentication
  - Shopping cart
  - Checkout process
  - Order history
  - Product reviews
  - Wishlist

- **Admin dashboard**
  - Sales analytics
  - Order management
  - Product management
  - Category management
  - User management
  - Review moderation

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Image Storage**: Vercel Blob
- **Deployment**: Vercel
