
# Smart Home System - Setup Guide

Welcome to the Smart Home Control System! This guide will help you set up both the backend and frontend parts of the application and connect everything seamlessly.

---

## 1. 🔧 Backend Setup (Django)

### Prerequisites

- Install **Visual Studio Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Install **Python 3.10+**: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Install **pip** (Python package installer)
- Install **Git**: [https://git-scm.com/downloads](https://git-scm.com/downloads)

### Steps

1. Open VS Code and open a terminal (`Ctrl + ~`).
2. Clone the project repository:
   ```bash
   git clone <your-backend-repo-url>
   cd <your-project-directory>
   ```
3. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
4. Install project dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

---

## 2. 🌐 Frontend Setup (React.js)

### Prerequisites

- Install **Node.js** (v18+): [https://nodejs.org/](https://nodejs.org/)
- npm is bundled with Node.js

### Steps

1. Open a terminal and clone the frontend repository:
   ```bash
   git clone <your-frontend-repo-url>
   cd smart-home-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 3. ▶️ Running the Backend

1. Activate the virtual environment:
   ```bash
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
2. Run the development server:
   ```bash
   python manage.py runserver
   ```
3. Backend will be available at:
   ```
   http://127.0.0.1:8000/
   ```

---

## 4. 💻 Running the Frontend

1. Open terminal in the `smart-home-frontend` directory.
2. Run the development server:
   ```bash
   npm start
   ```
3. React app will be available at:
   ```
   http://localhost:3000/
   ```

---

## 5. 🔐 Default Login Credentials

| Role    | Username   | Password   |
|---------|------------|------------|
| Admin   | admin      | admin123   |
| User    | testuser1  | user123    |
| User    | testuser2  | user123    |

---

## 6. ⚙️ Connect to Backend as Superuser

To view the database tables (admin panel):

1. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
   - Follow the prompts to enter a username, email, and password.
2. Access the Django admin panel:
   ```
   http://127.0.0.1:8000/admin/
   ```
3. Log in using the superuser credentials you just created.
4. You can now view and manage Users, Appliances, Logs, and more.

---

📘 You're now ready to explore the Smart Home System!
