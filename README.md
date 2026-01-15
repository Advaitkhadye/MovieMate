# MovieMate

A modern, full-stack movie ticket booking application designed to deliver a smooth booking experience. MovieMate is a movie ticket-booking system with a modern ui interface for browsing, booking, and managing movie tickets.

## Key Features

### For Users
*   **Discover Movies:** Browse through a visually appealing catalog of the latest hits and upcoming releases.
*   **Interactive Booking:** Select your preferred seats with a real-time, interactive seating layout.
*   **Booking Cancellation** You can cancel your booked tickets prior to one hour before .   
*   **Secure Payments:** Integrated payment gateways for safe and hassle-free transactions(right now in test mode).
*   **Digital Tickets:** Instant booking confirmation with QR codes for easy check-ins.
*   **Personalization:** Save your favorite movies and view your complete booking history.

## Tech Stack

MovieMate leverages a modern stack to ensure performance, scalability, and security.

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

## Getting Started

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
