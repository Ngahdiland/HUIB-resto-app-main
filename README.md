# HuibApp Food Delivery & Admin System

A modern food delivery and restaurant management platform for Cameroonian cuisine, built with Next.js and PostgreSQL. The system provides a seamless experience for both customers and administrators, featuring real-time order management, analytics, and a beautiful, responsive UI.

---

## 🚀 Features

### For Customers
- **Browse Menu**: Explore traditional Cameroonian dishes with images, categories, and details.
- **Cart & Checkout**: Add items to cart, manage quantities, and complete secure checkout.
- **Order Tracking**: View your orders and their statuses.
- **Reviews & Feedback**: Submit reviews and feedback for products and service.
- **Support**: Contact support or submit complaints directly from the app.

### For Admins
- **Dashboard**: View key metrics (orders, revenue, users, etc.) and analytics.
- **Order Management**: Record, update, and filter orders. Print invoices and manage order statuses (paid/canceled).
- **Product Management**: Add, edit, or remove menu items.
- **Payments**: Track and manage payments, including mobile money integrations.
- **User Management**: View and manage registered users.
- **Reviews & Feedback Moderation**: Approve or reject reviews and feedback.
- **Settings**: Configure business, payment, delivery, and security settings.

---

## 🛠️ Technologies Used
- **Next.js** (App Router, SSR/SSG)
- **React** (Client-side interactivity)
- **PostgreSQL** (Primary database)
- **Tailwind CSS** (Styling)
- **TypeScript** (Type safety)
- **JWT** (Authentication)
- **RESTful API** (Custom endpoints under `/api`)
- **Session Management** (Custom utility)
- **JSON Data Files** (For mock/demo data)

---

## 📁 Folder Structure (Key Directories)
- `app/` - Next.js app directory (routes, pages, API endpoints)
  - `(admin)/` - Admin dashboard and management pages
  - `(client)/` - Customer-facing pages
  - `(auth)/` - Authentication (login/register)
  - `api/` - API routes for products, orders, payments, etc.
- `components/` - Reusable React components (navbar, sidebar, cards, etc.)
- `context/` - React context providers (e.g., cart)
- `data/` - JSON files for products, orders, users, etc. (for demo/testing)
- `hooks/` - Custom React hooks
- `lib/` - Utility libraries (e.g., authentication)
- `utils/` - Helper utilities (e.g., session management)
- `public/` - Static assets (images, icons)

---

## ⚙️ Environment Setup

Before running the application, set up environment variables. Create a `.env` file in the root directory with the following:

```bash
# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

---

## 🏁 Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn install && yarn dev
# or
pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 📄 License
This project is for educational/demo purposes. For production use, please review and update security, authentication, and deployment settings.

---

*This project was bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).*
