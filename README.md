# Roamora 🌍

Roamora is a design-forward, highly responsive full-stack accommodation discovery platform inspired by Airbnb. It connects design-loving travelers with handpicked, character-filled stays across beaches, mountains, cities, castles, and domes.

## ✨ Premium Features

*   **Responsive Multi-Device Layout**: Fully optimized with a bespoke 5-breakpoint layout engine spanning desktop, tablet, and mobile (featuring an interactive sliding mobile drawer navigation with animated hamburger-to-close toggles).
*   **Listing Discovery & Management**: Explore unique stays with high-contrast cards, detailed descriptions, and category-focused image collections. Users can host and list new properties with robust form validation.
*   **Smart Category Filters & Search**: Real-time client-side search filtering matched with custom property tags like 🏰 **Castles**, 🏊 **Amazing Pools**, ⛺ **Camping**, 🚜 **Farms**, ❄️ **Arctic**, 🔮 **Domes**, ⛵ **Boats**, and 🛏️ **Rooms**.
*   **Bespoke Dark & Light Mode**: Smooth theme toggling styled with modern CSS variables, persisting client settings seamlessly in `localStorage`.
*   **Interactive Reviews**: Dedicated rating stars and feedback card decks for every property.
*   **Secure Authentication & Session Store**: Secured with custom local username/password authentication, running on a resilient MongoDB-backed session database using `connect-mongo`.
*   **Smart Routing**: Built-in authentication middleware to guarantee secure authorization for listing manipulation and listing ownership.
*   **🎟️ Interactive Mock Booking System**: A fully animated, multi-state booking panel on every listing detail page:
    *   **Dynamic Price Calculator** — Total cost updates live as check-in/check-out dates are selected, reflecting exact nights, service fees, and grand totals.
    *   **Input Validation & Shake Animation** — Missing or invalid dates trigger an error banner and a smooth CSS shake animation on the form card.
    *   **3-Step Loading Sequence** — Clicking "Reserve now" transitions the panel into an animated stepper showing spinning progress icons for: availability check → price lock → token generation.
    *   **Booking Confirmation Screen** — On completion, a drawing checkmark SVG animation reveals a confirmation card with a random booking ID, selected dates, guest count, and total price.
    *   **Confetti Burst** — Colorful confetti pieces rain down on successful mock booking.
    *   **Reset Flow** — A "Cancel / Reset" button returns the panel to its initial state cleanly.


---

## 🛠️ Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB & Mongoose
*   **Session Management**: `express-session`, `cookie-parser`, `connect-mongo` (Atlas-ready persistent session store)
*   **Security**: Custom local authentication and authorization middleware, `bcrypt` for password hashing
*   **Template Engine**: EJS (with EJS-Mate layouts)
*   **Styling**: Modern CSS3, responsive breakpoints, variable-based theme layers (no bloated libraries)

---

## ⚙️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/SriRamCharan-dev/-Roamora.git
cd -Roamora
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/roamora?retryWrites=true&w=majority
SESSION_SECRET=your_long_secure_session_secret
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
CLOUD_NAME=your_cloudinary_name
```

### 4. Seed the Database
Ensure your MongoDB local instance is running, or that you have specified an `ATLASDB_URL`. Run:
```bash
# Seed initial sample listings
node init/index.js

# Seed additional category-specific listings (30+ premium stays)
node init/seed-additional.js

# Update listings with correct high-quality Unsplash image assets
node init/update-images.js
```

### 5. Run the Application
```bash
nodemon app.js
```
Open **`http://localhost:5000`** in your browser.

---

## 🚀 Deploying to Render

To deploy this application on [Render](https://render.com/):

### 1. Create a Web Service
*   Connect your GitHub repository to Render.
*   Set the **Runtime** to `Node`.
*   Set the **Build Command** to `npm install`.
*   Set the **Start Command** to `node app.js`.

### 2. Configure Environment Variables
In the **Environment** tab of your Render Web Service, add the following variables:
*   `NODE_ENV` = `production`
*   `ATLASDB_URL` = Your MongoDB Atlas Connection String
*   `SESSION_SECRET` = A secure random string for signing sessions
*   *Note: Render will automatically bind to the dynamic port using `process.env.PORT`.*
