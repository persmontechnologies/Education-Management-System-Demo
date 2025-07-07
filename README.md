# EduSys Pro - School Management System

EduSys Pro is a modern, intuitive school management system designed specifically for Ugandan secondary schools. It provides a comprehensive suite of tools to manage students, teachers, classes, attendance, and more, with a focus on simplicity and efficiency.

## Key Features

* **Dashboard:** A comprehensive overview of key school statistics, including student and teacher demographics, attendance trends, and financial summaries.
* **Student Management:** Manage student records, including personal details, enrollment, and academic performance.
* **Teacher Management:** Keep track of teacher information, assigned classes, and contact details.
* **Class Management:** Organize classes from S1 to S6, assign teachers, and manage student enrollments.
* **Attendance Tracking:** A simple interface for recording and monitoring daily student attendance.
* **Financials:** Basic financial tracking, with support for Ugandan Shillings (UGX).
* **AI-Powered Assistant:** Integrated with Google Gemini for intelligent data queries and assistance.

## Tech Stack

* **Frontend:** React, TypeScript, Vite
* **UI Components:** Custom-built with a focus on a clean and modern aesthetic.
* **AI:** Google Gemini API

## Getting Started

**Prerequisites:**

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* An active Google Gemini API Key

**Installation & Setup:**

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/edusys-pro.git
    cd edusys-pro
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Gemini API key:

    ```env
    VITE_GEMINI_API_KEY=YOUR_API_KEY
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
