# TukTuk FairFare  - Sri Lanka Tourist Fare Verifier

## 1. Selected Sri Lankan Problem
Foreign tourists visiting Sri Lanka frequently face arbitrary and heavily inflated prices from unmetered three-wheelers (tuk-tuks) in high-traffic tourist hubs such as Colombo Fort, Kandy, and Galle Fort. Due to lack of transparency and language barriers, travelers are often overcharged by 2x–5x the gazetted rates, leading to disputes and negatively impacting Sri Lanka's tourism reputation.

## 2. Proposed Solution
TukTuk FairFare is a mobile-first web application designed for on-the-go tourists to instantly check legal, regulated fares based on travel distance and time of day. It provides a quick calculation engine based on gazetted provincial tariff rates alongside verified benchmark routes and local scam alerts.

## 3. Main Features
* **Dynamic Fare Calculation Engine:** Computes standard meter rates (LKR 110 first km + LKR 90 subsequent km) with an optional 15% night-time surcharge toggle.
* **Input Validation & Error Handling:** Real-time form validation preventing negative, zero, or out-of-range distance entries with readable error messages.
* **Benchmark Route Directory:** Searchable catalog of popular tourist journeys (e.g., Bandaranaike Airport to Colombo Fort) displaying fair price bands and practical scam tips.
* **Mobile-Responsive UI:** High-contrast, clean interface built for quick accessibility on mobile browsers while traveling.

## 4. Technologies Used
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment:** Vercel (Frontend), Render (Backend)

## 5. AI Tools Used & Declaration
* **Antigravity / ChatGPT:** Used to generate the base responsive UI components and form structures; our team rewrote the client-side validation logic and customized the styling.
* **ChatGPT:** Used to format and seed the realistic tourist route benchmark data; our team manually verified distances and LKR fare calculations against local rates.

## 6. Team Members & Contributions
* **Member 1 (Sujana Dinuwara - [IT24103033]):** Problem & Solution Design, Git Repository Management, Testing & Deployment.
* **Member 2 (Bandara MMSD - [IT24103089]):** UI Development — Responsive components, navigation, input forms, and client validation error states.
* **Member 3 (Dulshan P A - [IT24102599]):** Functional Implementation — Express API endpoints, fare calculation algorithms, and database route seeding.

## 7. Installation & Execution Instructions

### Prerequisites
* Node.js (v18 or higher)
* MongoDB URI (local or Atlas)

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)[your-username]/tuktuk-fairfare.git
   cd tuktuk-fairfare