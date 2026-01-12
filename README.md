# 🎵 Musicfy

**Musicfy** is a full-stack, production-ready music streaming platform focused on performance, scalability, and secure subscription-based access.  
It enables users to discover, stream, and manage music while integrating modern authentication, payments, and real-time data handling.

🌐 **Live Demo:** https://musicfy-lake.vercel.app/

---

## ✨ Features

- 🎧 High-performance music streaming
- ❤️ Like and manage favorite songs
- 🔐 Secure authentication with Supabase Auth
- 💳 Subscription-based access using Stripe
- ⚡ Real-time database updates
- 📱 Fully responsive UI
- 🧱 Clean, modular, and scalable architecture

---

## 🛠 Tech Stack

| Layer                | Technology                |
| -------------------- | ------------------------- |
| **Framework**        | Next.js 16+ (App Router)  |
| **Styling**          | Tailwind CSS v4           |
| **Database & Auth**  | Supabase (PostgreSQL v17) |
| **Payments**         | Stripe (Subscriptions)    |
| **State Management** | Zustand / React Query     |
| **UI Components**    | Radix UI                  |
| **Deployment**       | Vercel                    |

---

## 🏗 Architecture Overview

### Authentication Flow

1. User signs up or logs in via Supabase Auth.
2. Supabase Auth creates a record in `auth.users`.
3. A database trigger inserts a corresponding row into `public.users`.
4. The application uses Row Level Security (RLS) to enforce access control.

### Subscription Flow

1. User subscribes via Stripe Checkout.
2. Stripe sends webhook events to `/api/webhooks`.
3. Webhooks synchronize:
   - `customers`
   - `products`
   - `prices`
   - `subscriptions`
4. Application checks subscription status to unlock premium features.

### Music Access

- Song metadata is stored in PostgreSQL.
- Audio and image assets are referenced via storage paths.
- Access rules are enforced through Supabase policies and subscription checks.

---

## 🗄 Database Schema

> ⚠️ **Note:** The following schema is provided for documentation and architectural context only.

### Core Tables

- **users** – Application-level user profile linked to Supabase Auth
- **customers** – Stripe customer mapping
- **products** – Stripe products
- **prices** – Stripe pricing plans
- **subscriptions** – User subscription state
- **songs** – Uploaded and available music
- **liked_songs** – User likes and favorites

### Schema Definition

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.customers (
  id uuid NOT NULL,
  stripe_customer_id text,
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.liked_songs (
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  song_id bigint NOT NULL,
  CONSTRAINT liked_songs_pkey PRIMARY KEY (user_id, song_id),
  CONSTRAINT liked_songs_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id),
  CONSTRAINT liked_songs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.prices (
  id text NOT NULL,
  product_id text,
  active boolean,
  description text,
  unit_amount bigint,
  currency text CHECK (char_length(currency) = 3),
  type USER-DEFINED,
  interval USER-DEFINED,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb,
  CONSTRAINT prices_pkey PRIMARY KEY (id),
  CONSTRAINT prices_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

CREATE TABLE public.products (
  id text NOT NULL,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE public.songs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  title text,
  song_path text,
  image_path text,
  author text,
  user_id uuid,
  CONSTRAINT songs_pkey PRIMARY KEY (id),
  CONSTRAINT songs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.subscriptions (
  id text NOT NULL,
  user_id uuid NOT NULL,
  status USER-DEFINED,
  metadata jsonb,
  price_id text,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  current_period_start timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  current_period_end timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  ended_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  cancel_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  canceled_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  trial_start timestamp with time zone DEFAULT timezone('utc'::text, now()),
  trial_end timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_price_id_fkey FOREIGN KEY (price_id) REFERENCES public.prices(id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.users (
  id uuid NOT NULL,
  full_name text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
```

## 📋 Prerequisites

You must have active accounts with:

Supabase:

- Authentication enabled
- PostgreSQL database
- Row Level Security (RLS) policies
- Auth trigger to populate public.users

Stripe

- Products and recurring prices
- Webhooks enabled

## ⚙️ Environment Configuration

Create a .env file in the project root:

```env
# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Environment Variable Notes

- SUPABASE_SERVICE_ROLE_KEY must never be exposed to the client.
- All NEXT*PUBLIC*\* variables are safe for client-side use.
- Stripe webhook secret is required for subscription synchronization.

## 🚀 Setup & Installation

1. Clone the Repository

```bash
git clone https://github.com/Medo-ID/Musicfy.git
cd Musicfy
```

2. Install Dependencies

```bash
npm install
```

3. Run the Development Server

```bash
npm run dev
```

## 🔔 Stripe Webhook (Local Development)

Use the Stripe CLI to forward webhook events:

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

Copy the generated webhook signing secret into your .env file.

## 🔐 Security Considerations

- All sensitive operations rely on Supabase Row Level Security.
- Stripe webhooks are verified using signature validation.
- Subscription state is treated as the source of truth for premium access.
- Service role keys are restricted to server-side usage only.

## 🤝 Contributing

Contributions are welcome and encouraged.

### How to Contribute

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/YourFeature
```

3. Commit your changes

```bash
git commit -m "Add YourFeature"
```

4. Push to your fork

```bash
git push origin feature/YourFeature
```

5. Open a Pull Request

### Roadmap Ideas

- User-created playlists
- Advanced search and discovery
- Social profiles and artist following
- Audio quality and bitrate controls

## 📄 License

Distributed under the MIT License.

## 👤 Maintainer

Mohamed Idaghdour
GitHub: [Medo-ID][def]

[def]: https://github.com/Medo-ID
