# Showroom Display App

A Next.js showroom display app for creating spec sheets with QR codes. Staff manage displays in an admin panel; customers scan a QR code to view product details on their phone.

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL + Storage)
- **qrcode.react** for printable QR codes

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run the contents of `supabase/schema.sql`.
3. Copy your project URL and anon key from **Project Settings → API**.

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app (used in QR codes), e.g. `https://your-domain.com` |

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/admin` | List and manage displays |
| `/admin/new` | Create a new display |
| `/admin/[id]/edit` | Edit an existing display |
| `/display/[id]` | Public mobile spec sheet (QR code target) |

## Usage

1. Go to **Admin Panel** and click **New Display**.
2. Enter a display name and add items with description, quantity, RRP, and images.
3. Click **Save Display** — a printable QR code appears linking to `/display/[id]`.
4. Print the QR code and place it on the showroom display.
5. Customers scan the code to view the spec sheet on their phone.

## Security note

The default RLS policies allow open read/write for development. Before production, add Supabase Auth and restrict write access to authenticated staff.
