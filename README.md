# MovieMate 🎬

A modern, full-stack movie booking application designed to deliver a seamless cinema experience. MovieMate bridges the gap between moviegoers and theaters with an intuitive interface for browsing, booking, and managing movie tickets.

## 🚀 Overview

MovieMate is built to be fast, responsive, and user-friendly. Whether you're a user looking to catch the latest blockbuster or an administrator managing theater schedules, MovieMate provides a smooth and efficient platform to handle it all.

## ✨ Key Features

### For Users
*   **Discover Movies:** Browse through a visually appealing catalog of the latest hits and upcoming releases.
*   **Interactive Booking:** Select your preferred seats with a real-time, interactive seating layout.
*   **Secure Payments:** Integrated payment gateways for safe and hassle-free transactions.
*   **Digital Tickets:** Instant booking confirmation with QR codes for easy check-ins.
*   **Personalization:** Save your favorite movies and view your complete booking history.
*   **Responsive Design:** A beautiful experience across desktop, tablet, and mobile devices.

### For Administrators
*   **Dashboard:** A comprehensive overview of platform performance and bookings.
*   **Show Management:** effortless tools to add, update, and schedule movie shows.
*   **Booking Management:** full control to view and manage customer bookings.

## 🛠️ Tech Stack

MovieMate leverages a powerful modern stack to ensure performance, scalability, and security.

### Frontend
*   **React (Vite):** For a lightning-fast and dynamic user interface.
*   **Tailwind CSS:** For modern, responsive, and custom styling.
*   **Clerk:** For best-in-class authentication and user management.
*   **Axios:** For efficient API communication.

### Backend
*   **Node.js & Express:** For a robust and scalable server architecture.
*   **MongoDB:** For flexible and high-performance data storage.
*   **Stripe:** For secure and reliable payment processing.
*   **Nodemailer:** For reliable email notifications.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/yourusername/MovieMate.git
    ```
2.  **Install dependencies** (Frontend & Backend)
    ```sh
    cd client && npm install
    cd ../server && npm install
    ```
3.  **Configure Environment**
    Create `.env` files in both client and server directories with your API keys (MongoDB, Clerk, Stripe).

4.  **Run the App**
    ```sh
    # Run Backend
    cd server && npm run server

    # Run Frontend
    cd client && npm run dev
