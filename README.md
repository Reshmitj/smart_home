
# Smart Home System - Setup Guide

Welcome to the Smart Home Control System! This guide will help you set up both the backend and frontend parts of the application and connect everything seamlessly.

---

## Project Setup

1. Download the project as a ZIP:
   - Click on the `< > Code` button (on the right side of the page)
   - Click **Download ZIP**
2. Unzip the downloaded folder.
3. Open **Visual Studio Code**
   - Click **Open Folder** and select the **smart_home** unzipped folder.

## 1. 🔧 Backend Setup (Django)

### Prerequisites

- Install **Visual Studio Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Install **Python 3.10+**: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Install **pip** (Python package installer)

For a detailed step-by-step guide on installing python on Windows:
https://www.geeksforgeeks.org/how-to-install-python-on-windows/

### Steps

1. Open VS Code and open a terminal (`Ctrl + ~`).
2. Clone the project repository:
   ```bash
   cd smart_home_backend
   ```
3. Install project dependencies:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt corsheaders
   ```
4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

---

## 2. 🌐 Frontend Setup (React.js)

### Prerequisites

- Install **Node.js** (v18+): [https://nodejs.org/](https://nodejs.org/)
- npm is bundled with Node.js

For a detailed step-by-step guide on installing Node.js on Windows:

📘 https://www.geeksforgeeks.org/install-node-js-on-windows/

### Steps

1. Open a terminal and clone the frontend repository:
   ```bash
   cd smart-home-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 3. ▶️ Running the Backend

1. Run the development server:
   ```bash
   python manage.py runserver
   ```
2. Backend will be available at:
   ```
   http://127.0.0.1:8000/admin
   ```

   > **Login Credentials**  
   > Username: `admin`  
   > Password: `admin`

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
**⚠️ Note:** Please run backend and frontend in separate terminals.

---

## 5. 🔐 Default Login Credentials

| Role    | Username   | Password   |
|---------|------------|------------|
| Admin   | admin1      | admin   |
| User    | john_user1  | test    |
| User    | testuser2  | test    |

---

