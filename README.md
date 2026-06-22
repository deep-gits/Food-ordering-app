<div align="center">

  <h1>🍔 CraveBites Food Ordering Platform</h1>

  <p>
    <strong>A full-stack, responsive, and modern food ordering application built with the MERN stack.</strong>
  </p>

  <p>
    <a href="https://food-ordering-app-woad-nine.vercel.app/" target="_blank">View Live Demo</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#installation">Installation</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="Stripe" />
  </p>
</div>

<br />

## 🌟 About The Project

This is a complete, feature-rich food ordering platform designed to provide a seamless experience for both customers and restaurant administrators. From browsing the menu with beautiful animations to securely processing payments with Stripe, every aspect has been carefully crafted.

> **Live Website:** [https://food-ordering-app-woad-nine.vercel.app/](https://food-ordering-app-woad-nine.vercel.app/)

<details>
  <summary><strong>✨ View Key Features (Click to expand)</strong></summary>

  <br />

  - **🍕 Interactive Menu:** Browse through categories and distinct food items easily.
  - **🛒 Smart Cart System:** Manage your cart items, quantities, and real-time total calculation.
  - **🔐 Secure Authentication:** JWT-based secure user registration and login.
  - **💳 Stripe Payment Integration:** Fully functional and secure checkout process.
  - **📱 Fully Responsive Design:** Optimized for all devices (Mobile, Tablet, Desktop) using Tailwind CSS.
  - **🎬 Smooth Animations:** Framer Motion integrated for delightful UI micro-interactions.
  - **🛠️ Admin Dashboard (Optional/If Appliable):** Manage products, categories, and view orders.
</details>

## 🚀 Built With

The project uses a modern web development stack:

### Frontend
- [React (Vite)](https://vitejs.dev/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) - Form validation
- [Stripe Elements](https://stripe.com/docs/stripe-js) - Secure payments

### Backend
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) - Server & API routing
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [Multer](https://www.npmjs.com/package/multer) - Image uploads

---

## 💻 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB account and connection string
- Stripe account (for payment processing)

### Installation

<details>
  <summary><strong>1. Clone the repository</strong></summary>

  ```bash
  git clone https://github.com/your-username/food-ordering-app.git
  cd food-ordering-app
  ```
</details>

<details>
  <summary><strong>2. Backend Setup</strong></summary>

  Navigate to the `server` folder, install dependencies, and set up your environment variables.

  ```bash
  cd server
  npm install
  ```

  Create a `.env` file in the `server` directory and add your credentials:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  STRIPE_SECRET_KEY=your_stripe_secret_key
  ```

  Run the server:
  ```bash
  npm run dev
  ```
</details>

<details>
  <summary><strong>3. Frontend Setup</strong></summary>

  Open a new terminal, navigate to the `client` folder, install dependencies, and set up the frontend variables.

  ```bash
  cd client
  npm install
  ```

  Create a `.env` file in the `client` directory:
  ```env
  VITE_API_URL=http://localhost:5000/api
  VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
  ```

  Run the frontend:
  ```bash
  npm run dev
  ```
</details>

---

## 📂 Project Structure

A quick look at the top-level files and directories:

```text
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── store/          # Redux slices and store config
│   │   └── utils/          # Helper functions
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js      # Vite configuration
│
└── server/                 # Node.js backend
    ├── controllers/        # Route logic and handlers
    ├── middleware/         # Custom Express middlewares (Auth, etc.)
    ├── models/             # Mongoose database schemas
    ├── routes/             # API route definitions
    └── server.js           # Express application entry point
```

---

## 🤝 Contributing

Contributions make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Crafted with ❤️ and ☕</p>
</div>
