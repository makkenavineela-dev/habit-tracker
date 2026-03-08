# Ritual Flow — Habit Tracker

A modern, high-performance habit tracker built for peak consistency. Ritual Flow combines beautiful aesthetics with robust data management, allowing you to track daily rituals, weekly focus areas, and DSA progress.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file and fill in your Supabase credentials.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup (Supabase)**
   Run the following SQL in your Supabase SQL Editor to initialize the sync table:
   
   ```sql
   -- Create sync table
   create table public.user_sync (
     id uuid references auth.users not null primary key,
     data jsonb not null default '{}'::jsonb,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security
   alter table public.user_sync enable row level security;

   -- Create RLS Policies
   create policy "Users can update their own sync data" 
     on public.user_sync for update 
     using (auth.uid() = id);

   create policy "Users can insert their own sync data" 
     on public.user_sync for insert 
     with check (auth.uid() = id);

   create policy "Users can view their own sync data" 
     on public.user_sync for select 
     using (auth.uid() = id);
   ```

4. **Launch**
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 + Vite |
| **Styling** | Vanilla CSS + Framer Motion |
| **State** | Zustand + Persist Middleware |
| **Database** | Supabase (PostgreSQL + Auth) |
| **Mobile** | Capacitor (iOS & Android) |
| **Testing** | Vitest + React Testing Library |

## 📱 Mobile Native Build

### Android
```bash
npm run build
npx cap sync android
npx cap open android
```

### iOS
```bash
npm run build
npx cap sync ios
npx cap open ios
```

## 🧪 Testing

We carry a comprehensive test suite covering the store, utilities, and complex UI logic.
```bash
npm run test
```

## 🔐 Security
- **Cloud Sync**: All data is stored in LocalStorage first and debounced to Supabase.
- **Privacy**: RLS (Row Level Security) ensures only YOU can access your habit data.
- **Safe Recovery**: Targeted storage clearing prevents data loss during minor corruptions.
