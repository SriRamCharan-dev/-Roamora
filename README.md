# Roamora 🌍

Roamora is a design-forward, highly responsive full-stack accommodation discovery platform inspired by Airbnb. It connects design-loving travelers with handpicked, character-filled stays across beaches, mountains, cities, castles, and domes.

---

---

## ✨ Premium Features

*   **Responsive Multi-Device Layout**: Fully optimized with a bespoke 5-breakpoint layout engine spanning desktop, tablet, and mobile (featuring an interactive sliding mobile drawer navigation with animated hamburger-to-close toggles).
*   **Listing Discovery & Management**: Explore unique stays with high-contrast cards, detailed descriptions, and category-focused image collections. Users can host and list new properties with robust form validation.
*   **Smart Category Filters & Search**: Real-time client-side search filtering matched with custom property tags like 🏰 **Castles**, 🏊 **Amazing Pools**, ⛺ **Camping**, 🚜 **Farms**, ❄️ **Arctic**, 🔮 **Domes**, ⛵ **Boats**, and 🛏️ **Rooms**.
*   **Bespoke Dark & Light Mode**: Smooth theme toggling styled with modern CSS variables, persisting client settings seamlessly in `localStorage`.
*   **Interactive Reviews**: Dedicated rating stars and feedback card decks for every property.
*   **Secure Authentication & Session Store**: Secured with custom local username/password authentication, running on a resilient MongoDB-backed session database using `connect-mongo`.
*   **Smart Routing**: Built-in authentication middleware to guarantee secure authorization for listing manipulation and listing ownership.
*   **🎟️ Interactive Mock Booking System**: A fully animated, multi-state booking panel on every listing detail page.

---
*(Add App Screenshot Here - Listings/Filter Page)*
---

## 🛠️ Our Approach & Architecture

The architecture of Roamora follows a monolithic MVC (Model-View-Controller) design pattern. The application uses server-side rendering (SSR) via EJS, combined with modern vanilla JavaScript on the frontend for interactive elements (such as dark mode toggling and mobile menus).

*   **Backend**: Node.js and Express.js handle all the routing, server logic, and middleware integrations.
*   **Database**: MongoDB via Mongoose ORM. Data is normalized across `Users`, `Listings`, and `Reviews` with cross-references.
*   **Session Management**: Express-session with persistent MongoDB storage (`connect-mongo`).
*   **Security**: Passwords are cryptographically hashed using `bcrypt`. Route protection is enforced via custom authorization middleware, ensuring users can only edit/delete their own listings and reviews.
*   **Image Storage**: Cloudinary is used to securely upload and host listing images.
*   **Styling**: Pure CSS (no heavy UI libraries), maintaining a lightweight bundle with a sophisticated, highly customizable UI.

---
*(Add App Screenshot Here - Single Listing / Booking Page)*
---

## 🔌 API & Services

### **Third-Party Services Integration**
*   **MongoDB Atlas**: Managed cloud database service used for persistent data storage.
*   **Cloudinary**: Cloud-based image management service for uploading, storing, and serving high-resolution listing images.
*   **Render**: (Or Vercel) Cloud application hosting platform for seamless deployment.

### **Core API Routes**

#### **Listings (`/listings`)**
*   `GET /listings` - Fetches and displays all available property listings.
*   `GET /listings/new` - Renders the form to create a new property listing.
*   `POST /listings` - Creates a new listing (Requires Authentication & Image Upload).
*   `GET /listings/:id` - Shows detailed information for a specific listing, including reviews and booking panel.
*   `GET /listings/:id/edit` - Renders the form to edit an existing listing (Requires Listing Owner).
*   `PUT /listings/:id` - Updates the details of a specific listing (Requires Listing Owner).
*   `DELETE /listings/:id` - Deletes a specific listing and its associated reviews (Requires Listing Owner).

#### **Reviews (`/listings/:id/reviews`)**
*   `POST /listings/:id/reviews` - Adds a new review and rating to a listing (Requires Authentication).
*   `DELETE /listings/:id/reviews/:reviewId` - Deletes a specific review (Requires Review Owner).

#### **User Authentication (`/`)**
*   `GET /signup` - Renders the registration form.
*   `POST /signup` - Registers a new user and logs them in.
*   `GET /login` - Renders the login form.
*   `POST /login` - Authenticates user credentials and creates a session.
*   `GET /logout` - Destroys the current user session.

---
*(Add App Screenshot Here - Login / Signup Page)*
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
npm start
```
Open **`http://localhost:5000`** in your browser.

---
*(Add App Screenshot Here - Dark Mode / Theme Toggling)*
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
