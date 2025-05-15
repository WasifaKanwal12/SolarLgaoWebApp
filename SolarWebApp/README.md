

  
  

\#Project Structure

  

SolarLgaoWebApp/

├── Prototype/

├── solarbot/

|   ├── .env

|   ├── solarbot.py

|   ├── solar\_function.py

|   ├──  requirements.txt

└── SolarWebApp/

    ├── .env

    ├── package.json

    ├── README.md

    ├── public/

    └── src/

        ├── app/

        │   ├── admin/

        │   ├── api/

        │   │   ├── auth/

        │   │   │   ├── signin/

        │   │   │   │   ├── emailPassword/

        │   │   │   │   └── google/

        │   │   │   ├── signup/

        │   │   │   └── verification/

        │   │   ├── chatbot/

        │   │   ├── orders/

        │   │   ├── providers/

        │   │   ├── recommendation/

        │   │   ├── reviews/

        │   │   ├── spreadsheet/

        │   │   └── users/

        │   ├── customer/

        │   ├── provider/

        │   ├── recommendation/

        │   ├── signin/

        │   ├── signup/

        │   ├── pending-approval/

        │   ├── pendingVerification/

        │   ├── unauthorized/

        │   ├── globals.css

        │   ├── layout.js

        │   └── page.js

        ├── components/

        └── lib/

  
  

Getting Started

  

Prerequisites:

Node.js (v18 or later)

npm (v9 or later)

Firebase account

Google Cloud account (for Gemini API)

FastAPI backend (for solar calculations)

  

Installation:

  

Clone the repository:

  

git clone https://github.com/yourusername/SolarLgaoWebApp.git

cd SolarWebApp

Install dependencies:

  

npm install

  

Set up environment variables:

  

Create a .env file in the root directory

  

Add the following variables:

  

NEXT\_PUBLIC\_FIREBASE\_API\_KEY=your\_firebase\_api\_key

NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN=your\_firebase\_auth\_domain

NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID=your\_firebase\_project\_id

NEXT\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET=your\_firebase\_storage\_bucket

NEXT\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID=your\_firebase\_messaging\_sender\_id

NEXT\_PUBLIC\_FIREBASE\_APP\_ID=your\_firebase\_app\_id

NEXT\_PUBLIC\_FIREBASE\_MEASUREMENT\_ID=your\_firebase\_measurement\_id

GEMINI\_API\_KEY=your\_gemini\_api\_key

GOOGLE\_CLIENT\_ID=your\_google\_client\_id

GOOGLE\_CLIENT\_SECRET=your\_google\_client\_secret

FASTAPI\_BACKEND\_URL=http://localhost:8000

  

Start the development server:

  

npm run dev

  
  

Features:

  

For Customers:

  

Get personalized solar system recommendations based on location and energy usage

Connect with verified solar providers

View estimated costs and savings

Export recommendations to Google Sheets

User authentication and profile management

  

For Providers:

  

Dashboard to manage services and orders

Customer management tools

Service tracking and analytics

Profile verification system

  

Technical Highlights:

  

Next.js 14 with App Router

Firebase Authentication

Google Spreadsheet API

Google Gemini API for chatbot

FastAPI backend for solar calculations

Google Sheets integration

Responsive design with Tailwind CSS

  
  

Deployment:

Vercel Deployment:

  

Push your code to a GitHub repository

Create a new project in Vercel

Connect your GitHub repository

Add all environment variables

Deploy!