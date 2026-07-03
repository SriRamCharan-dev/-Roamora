# Roamora 🌍

Roamora is a design-forward, full-stack accommodation discovery platform inspired by Airbnb. It connects design-loving travelers with handpicked, character-filled stays across beaches, mountains, and cities.

## ✨ Premium Features
- **Listing Discovery & Management**: Explore unique stays with high-contrast cards, detailed descriptions, and instant visual previews. Add new stays with built-in form validation.
- **Interactive Landing (Hero) Page**:
  - **Dynamic Particle Canvas**: Smooth floating background particle network on the landing page.
  - **Typewriter Effect**: Sleek cycling text showcasing recommended escapes.
  - **Aesthetic Metrics & Reviews**: Floating interactive details, guest ratings, and animated counters.
- **Theme Customization**: Native, smooth-switching **Dark and Light modes** with persistent `localStorage` settings and AAA-level contrast readability across all components.
- **Review System**: Create, view, and manage ratings and reviews for listings.
- **Secure Authentication & Session Management**: Safe onboarding with local username/password flows alongside a seamless **Google OAuth 2.0** login/signup option, built using Passport.js. Flash messages are integrated via `connect-flash` to notify users of successful actions or login errors.
- **Route Authorization**: Restricts access to sensitive routes. Users must be authenticated to create, edit, update, or delete listings. Unauthorized attempts trigger flash notifications, redirect users to the login page, and return them to their original page after successful login.
- **Context-Aware UI (Dynamic Navbar)**: The navigation bar adapts dynamically based on the user's login state, displaying "Login" and "Sign Up" links when unauthenticated, and "Log Out" when authenticated.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Templating Engine**: EJS (with EJS-Mate layout support)
- **Authentication**: Passport.js, Passport-Local (local email/password), Passport-Local-Mongoose, & Passport-Google-OAuth20 (Google OAuth 2.0 Strategy)
- **Middleware & Security**: Custom route protection middleware, session-based login status checks
- **Session & Messaging**: `express-session`, `cookie-parser`, and `connect-flash`
- **Styling**: Vanilla CSS with custom theme variables, responsive design, and CSS transitions.


## ⚙️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/SriRamCharan-dev/-Roamora.git
   cd -Roamora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and populate it with your Google API credentials:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
   > [!NOTE]
   > You can obtain these credentials by creating a project on the [Google Cloud Console](https://console.cloud.google.com/), enabling the Google+ API (or Google OAuth2 API), and setting the Authorized redirect URI to `http://localhost:5000/auth/google/callback`.


4. Ensure MongoDB is running locally:
   ```bash
   mongod
   ```

5. Seed the database (if needed):
   ```bash
   node init/index.js
   ```

6. Run the app:
   ```bash
   nodemon app.js
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.
