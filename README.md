# HR and Payroll Management System 🏢💼

Monolith is a comprehensive platform designed to streamline human resources and payroll management for organizations. This powerful system offers a robust backend built with NestJS and a PostgreSQL database, providing a complete solution for employee and payroll administration.

## ✨ Key Features

- 👥 **Employee Management**: Detailed employee information and records
- 💰 **Payroll Processing**: Efficient salary calculations and payments
- 🔐 **Secure Authentication**: JWT and Auth0 integration for robust security
- ⚙️ **System Configurations**: Customizable settings for organizational needs
- 💸 **Income and Expense Tracking**: Comprehensive financial management for employees
- 📅 **Payroll Period Management**: Flexible creation and closure of pay periods
- 📊 **Reporting and Analytics**: Insightful data on payments and employee statistics

## 🛠️ Technology Stack

### Backend
- 🚀 **Framework**: NestJS with TypeScript
- 🗃️ **Database**: PostgreSQL with Prisma ORM
- 🔑 **Authentication**: JWT and Auth0
- 📚 **API Documentation**: Swagger
- ✅ **Data Validation**: Class-validator and class-transformer

### Frontend (Next.js)
- ⚛️ **Framework**: Next.js with TypeScript
- 🎨 **Styling**: Tailwind CSS
- 🧩 **UI Components**: Custom components and Radix UI
- 🔄 **State Management**: React Hooks
- 🌐 **API Requests**: Fetch API
- 📅 **Date Handling**: Moment.js
- 🎨 **Icons**: Font Awesome

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/monolith.git
   cd monolith
   ```

2. Install dependencies for both client and server
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the client directory
   - Copy `.env.example` to `.env` in the server directory
   - Fill in the required details in both files (see Environment Variables section below)

4. Start the development servers:
   - For the client:
     ```bash
     cd client && npm run dev
     ```
   - For the server:
     ```bash
     cd server && npm run dev
     ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
