FitFuel: Your Personal Nutrition & Fitness Dashboard 🚀
FitFuel is a modern, full-stack MERN application designed to be your ultimate companion for making informed nutrition choices and tracking your fitness journey. It provides personalized calorie and macro goals, a comprehensive food and workout library, and real-time progress tracking to empower you to achieve your health objectives.

Live Demo:  [https://my-fitfuel.vercel.app]  

✨ Key Features
Full Authentication System: Secure user registration with JWT (JSON Web Tokens) and OTP verification via email (Nodemailer + Gmail SMTP). Includes a "Forgot Password" feature.

Personalized Dashboard: A dynamic dashboard that calculates:

BMI (Body Mass Index) and classifies it (e.g., Underweight, Normal, Overweight).

Daily Calorie Goal based on user's height, weight, age, gender, activity level, and fitness goal (weight loss, maintenance, or gain).

Net Calorie Balance: Tracks Calories Consumed - Calories Burned = Net Intake in real-time.

Meal & Workout Tracking:

Log meals from a comprehensive food library.

Log workouts from a diverse exercise library.

The meal and workout logs automatically reset every day.

Comprehensive Food Library:

Extensive lists of Everyday Indian Foods, fast food outlets (McDonald's, KFC), and specialized diet plans like Gym Diet (Veg & Non-Veg).

Includes a global food search to find any item across all categories instantly.

Comprehensive Workout Library:

Over 50 exercises categorized by type (Cardio, Strength, Sports).

Smart Logging: Log cardio by duration and strength exercises by sets & reps.

Automatic Calorie Burn Calculation based on the user's weight and the exercise's MET value.

Modern UI/UX:

Dark & Light Mode: A beautiful, animated theme toggle that saves user preference.

Fully Responsive Design: The UI is optimized for a seamless experience on both desktop and mobile devices.

Interactive & User-Friendly: Features include loading skeletons, interactive cards, and a slide-in mobile menu.

🛠️ Built With
This project is a full-stack MERN application built with modern technologies.

Frontend:
Backend:
Database:
Authentication:
🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js & npm: Make sure you have Node.js installed.

MongoDB Atlas Account: You will need a free MongoDB Atlas cluster.

Gmail Account with App Password: To send OTP emails, you'll need a Gmail account with 2-Step Verification enabled and an App Password generated.

Installation
Clone the repo:

git clone [https://github.com/your-username/fitfuel.git](https://github.com/your-username/fitfuel.git)

Backend Setup:

Navigate to the server directory: cd server

Install NPM packages: npm install

Create a .env file in the server directory and add your environment variables:

MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_KEY
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-gmail-app-password
CLIENT_URL=http://localhost:3000

Seed the database with food and workout data (run this once):

npm run seed
npm run seed-workouts

Start the server: npm start

Frontend Setup:

Open a new terminal and navigate to the client directory: cd client

Install NPM packages: npm install

Create a .env file in the client directory and add your backend URL:

REACT_APP_API_URL=http://localhost:5000