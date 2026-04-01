# Kbon E-Commerce Platform

A Full-stack E-commerce Platform built with a modern Monorepo architecture. 

## 🌟 Project Overview
The Kbon Platform is a comprehensive e-commerce solution offering robust frontend and backend services, efficiently managed using Turborepo. It leverages a powerful tech stack tailored for high performance, seamless development, and scalability:
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe Integration
- **Package Manager**: pnpm workspaces

## 🔧 Prerequisites
Make sure you have the following tools installed on your machine before getting started:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+)
- [Docker & Docker Compose](https://www.docker.com/) (For running PostgreSQL locally)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (For testing webhooks)

## 🔐 Environment Variables

You need to set up your environment variables before running the application.

### Backend (`apps/backend/.env`)
Create a `.env` file in the `apps/backend` directory using the following format:

```env
# Database connection
DATABASE_URL="postgresql://postgres:password@localhost:5434/kbon_db?schema=public"

# Authentication
JWT_SECRET="Your_Super_Secret_JWT_Key"
JWT_EXPIRES_IN="7d"

# Stripe Settings
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (if applicable, e.g. `apps/frontend/.env.local`)
Create an `.env.local` file in the `apps/frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📦 Installation

This project uses Turborepo and pnpm workspaces. Install all dependencies from the root directory:

```bash
pnpm install
```

## 🗄️ Database Setup

We use Docker to quickly spin up a PostgreSQL instance. The `docker-compose.yml` file is located at the root of the project.

1. **Start the Database**
   ```bash
   docker compose up -d
   ```
   *(This starts Postgres on port 5434 based on the default configuration)*

2. **Run Migrations**
   Navigate to the backend app to apply the schema to your database:
   ```bash
   cd apps/backend
   npx prisma migrate dev
   ```

3. **Seed the Database**
   Populate the database with initial dummy data:
   ```bash
   npx prisma db seed
   ```

## 💳 Stripe Setup (Crucial)

To test payments and webhooks locally, you must connect the Stripe CLI to your account and forward events to your local NestJS backend.

1. **Login to Stripe CLI**
   ```bash
   stripe login
   ```
   Follow the prompt in your browser to authenticate.

2. **Start the Webhook Listener**
   Forward webhook events to your backend's Stripe webhook endpoint:
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```
   *(Make sure to adjust the port or path if your backend is running elsewhere)*

3. **Configure the Webhook Secret**
   After running the `stripe listen` command, the CLI will output a webhook signing secret that looks like this: `whsec_...`. 
   Copy this value and place it in your `apps/backend/.env` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_from_cli
   ```

## 🚀 Running the Application

To start all applications (Frontend and Backend) simultaneously in development mode, run the following command from the root directory:

```bash
pnpm dev
```

- **Frontend** will be available at: `http://localhost:3000`
- **Backend API** will be available at: `http://localhost:3001`

---

Happy coding! 🚀
