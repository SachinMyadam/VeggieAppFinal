VeggieApp: A Real-Time Vegetable E-Commerce Platform
VeggieApp is a comprehensive, cross-platform mobile e-commerce application designed for selling fresh vegetables. It features a seamless, real-time user experience powered by a robust backend and a fully functional web-based admin panel for complete operational control.

🥕 Project Overview
VeggieApp addresses the need for a modern, convenient way for customers to purchase fresh produce. The ecosystem consists of two primary components:

The Customer Mobile App (React Native & Expo): An intuitive application for iOS and Android where users can browse products, manage a shopping cart, place orders, and receive live updates and push notifications.

The Admin Web Panel (HTML, CSS, JS): A secure, browser-based dashboard for business owners to manage inventory, pricing, and order fulfillment in real-time.

The entire system is built on a real-time architecture using Firebase Firestore. Any change made in the admin panel, such as updating a vegetable's price, is reflected instantly in every user's mobile app.

✨ Core Features & User Benefits
📱 Customer Mobile App
Real-Time Product Catalog: The home screen displays a live list of vegetables.

Benefit: Customers always see the most current inventory and pricing without needing to refresh.

Dynamic Shopping Cart: A fully functional cart managed with React Context.

Benefit: Effortlessly add, remove, and update item quantities with instant feedback.

Order History & Tracking: The profile screen displays a complete, real-time history of the user's past orders.

Benefit: Users can easily track their past purchases and see the status of their current orders.

Stock & Price Notifications: A "Notify Me" feature allows users to subscribe to alerts for out-of-stock items.

Benefit: Recovers lost sales by automatically notifying customers when a desired item is restocked or goes on sale.

💻 Admin Web Panel
Full Inventory Management (CRUD): Admins have complete control to Create, Read, Update, and Delete vegetables.

Benefit: Effortlessly manage the entire product catalog through an easy-to-use interface.

Real-Time Order Fulfillment Dashboard: The panel displays all incoming customer orders in a live feed.

Benefit: Admins can instantly see new orders as they are placed, enabling rapid processing.

Manual Notification Triggers: The admin panel is the central hub for sending all push notifications.

Benefit: This 100% free-tier solution allows admins to send targeted notifications for restocks, price drops, and order completions directly from their dashboard.

⚙️ Technology Stack
Frontend (Mobile App): React Native, Expo, Expo Router, TypeScript

Backend & Database: Google Firebase (Firestore, Firebase Authentication)

Admin Panel: HTML5, CSS3, JavaScript (ES Modules), Bootstrap 5

Push Notifications: Expo Push Notifications Service
🚀 Setup & Installation
To run this project locally, follow these steps:

Clone the repository:

git clone [https://github.com/your-username/VeggieAppFinal.git](https://github.com/your-username/VeggieAppFinal.git)
cd VeggieAppFinal

Install dependencies:

yarn install

Configure Firebase:

Create a firebaseConfig.js file in the root of the project.

Copy your Firebase project's configuration object into this file.

Run the mobile app:

npx expo start

Run the admin panel:

Serve the project folder using a local server.

npx serve

Open http://localhost:3000/admin.html in your browser.
