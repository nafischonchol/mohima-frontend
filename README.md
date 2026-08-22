# Mohimaa Frontend

Modern, high-performance web frontend for **Mohimaa** built with [Next.js](https://nextjs.org) (App Router), React 19, TypeScript, and Tailwind CSS.

---

## 📌 Features

- 🛍️ **Storefront & Product Catalog:** Fast product browsing, category filtering, search, and detail views.
- 📦 **Order Management & Checkout:** Seamless cart, order placement, and customer order tracking.
- 🔐 **Authentication & RBAC:** Secure auth flow with NextAuth.js and role-based permissions.
- 📊 **Admin Dashboard:** Order status transitions, inventory control, and courier integration management.
- 🎨 **Modern Design:** Responsive layout, sleek UI built with Tailwind CSS, Lucide icons, and Recharts.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Lucide Icons
- **State & UI:** Zustand, Base UI, Shadcn UI
- **Data Visualization:** Recharts

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn / pnpm / bun

### Installation & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3090](http://localhost:3090) in your browser to view the application.

---

## 📜 Build & Deployment

To build the production bundle:
```bash
npm run build
npm run start
```
