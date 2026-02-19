# Salad Khatora - Business Management System

A comprehensive business management application for Salad Khatora, built on the Internet Computer blockchain platform.

## 🔐 Authentication

This application uses **Internet Identity** for secure, passwordless authentication. Internet Identity is a blockchain-based authentication system that uses biometric authentication (fingerprint, Face ID) or security keys instead of traditional passwords.

### How to Access the Application

1. **Navigate to the Login Page**
   - Open the application in your browser
   - You will be automatically redirected to `/login` if you're not authenticated
   - The login page displays the Salad Khatora branding and a "Login to Continue" button

2. **Create Your Internet Identity** (First-time users)
   - Click the "Login to Continue" button
   - You'll be redirected to the Internet Identity service at `https://identity.ic0.app`
   - Follow the on-screen instructions to create your Internet Identity:
     - Choose a device authentication method (biometric, security key, or passkey)
     - Complete the registration process
     - Your Internet Identity will be created and linked to your device

3. **Login with Existing Internet Identity**
   - Click the "Login to Continue" button
   - You'll be redirected to the Internet Identity service
   - Authenticate using your chosen method (fingerprint, Face ID, security key, etc.)
   - You'll be automatically redirected back to the application

4. **After Successful Login**
   - You will be redirected to the `/dashboard` page
   - All protected routes (Dashboard, Inventory, Products, Billing, Subscriptions, Reports, Customers) will be accessible
   - Your session will persist across browser refreshes

### Important Notes

- **No Traditional Credentials**: There are no username/password combinations. Each user creates their own Internet Identity using their device's authentication capabilities.
- **Device-Based Authentication**: Your Internet Identity is tied to your device's biometric or security key authentication.
- **No Pre-configured Admin Account**: Every user creates their own Internet Identity. There is no default admin username or password.
- **Secure & Private**: Internet Identity does not track your activity across different applications and provides anonymous authentication.

### Logout

- Click the "Logout" button in the top-right corner of the navigation bar
- You will be logged out and redirected to the login page
- To access the application again, you'll need to authenticate with Internet Identity

## 🚀 Features

- **Dashboard**: Overview of daily, weekly, and monthly sales metrics
- **Inventory Management**: Track ingredients, stock levels, and write-offs
- **Product Management**: Manage salad bowl products and recipes
- **Billing**: Generate invoices and track sales
- **Subscriptions**: Manage customer subscriptions and delivery schedules
- **Customer Management**: Store customer information and preferences
- **Reports**: Export data for inventory, sales, subscriptions, and expenses

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Motoko (Internet Computer)
- **Authentication**: Internet Identity
- **State Management**: React Query + Zustand
- **Routing**: TanStack Router

## 📱 Browser Compatibility

For the best experience with Internet Identity authentication:
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure your device supports biometric authentication or has a security key
- Enable JavaScript and cookies

## 🔒 Security

- All data is stored on the Internet Computer blockchain
- Authentication is handled by Internet Identity (no passwords stored)
- Secure, decentralized architecture
- End-to-end encryption for sensitive data

## 📞 Support

For issues or questions about authentication:
- Visit the [Internet Identity documentation](https://internetcomputer.org/docs/current/developer-docs/identity/internet-identity/overview)
- Check the [Internet Computer forum](https://forum.dfinity.org/)

---

Built with ❤️ using [caffeine.ai](https://caffeine.ai)
