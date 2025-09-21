FitFuel: Your Personal Nutrition & Fitness Dashboard 🚀
FitFuel is a modern, full-stack MERN application designed to be your ultimate companion for making informed nutrition choices and tracking your fitness journey. It provides personalized calorie and macro goals, a comprehensive food and workout library, and real-time progress tracking to empower you to achieve your health objectives.

Live Demo: https://my-fitfuel.vercel.app/

✨ Key Features
Full Authentication System: Secure user registration with JWT and OTP verification via email. Includes a "Forgot Password" feature.

Personalized Dashboard: A dynamic dashboard that calculates BMI, daily calorie goals (for weight loss, maintenance, or gain), and real-time net calorie balance.

Meal & Workout Tracking: Log meals and workouts from comprehensive libraries. All logs automatically reset daily.

Comprehensive Food & Workout Libraries: Extensive lists of Indian foods, fast food, and diet-specific items. A library of over 50 exercises with smart logging (duration for cardio, sets/reps for strength).

Modern UI/UX: A beautiful, animated Dark & Light Mode, a fully responsive design, and interactive elements for a premium user experience.

🛠️ Built With
This project is a full-stack MERN application built with modern technologies.

Frontend:
Backend:
Database:
Authentication & Services:
🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js & npm

MongoDB Atlas Account

Gmail Account with an App Password

Installation
Clone the Backend Repo:

git clone [https://github.com/owesh74/Fitfuel-Server-v2.git](https://github.com/owesh74/Fitfuel-Server-v2.git)

Clone the Frontend Repo:

git clone [https://github.com/owesh74/FitFuel-V2.git](https://github.com/owesh74/FitFuel-V2.git)

Backend Setup:

Navigate to the server directory: cd Fitfuel-Server-v2

Install packages: npm install

Create a .env file and add your variables:

MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_KEY
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-gmail-app-password
CLIENT_URL=http://localhost:3000

Seed the database (run this once):

npm run seed
npm run seed-workouts

Start the server: npm start

Frontend Setup:

Open a new terminal and navigate to the client directory: cd FitFuel-V2

Install packages: npm install

Create a .env file and add your backend URL:

REACT_APP_API_URL=http://localhost:5000
