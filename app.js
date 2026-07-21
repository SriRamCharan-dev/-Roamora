const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');
const listingRouter = require('./routes/listing');
const reviewRoute = require('./routes/review');
const userRouter = require('./routes/user');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const { clerkAuthMiddleware } = require('./appMiddleware');

// Trust Vercel's reverse proxy so HTTPS cookies work correctly
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
require('dotenv').config();

const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/airbnb';
const { MongoStore } = require('connect-mongo');

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET || 'mysupersecretstring'
  },
  touchAfter: 24 * 3600
});

store.on("error", (err) => {
  console.log("Error in Mongo Session Store:", err);
});

const isProduction = process.env.NODE_ENV === 'production';
const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET || 'mysupersecretstring',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  }
};

app.use(session(sessionOptions));
app.use(flash());

// Clerk authentication middleware — populates req.auth on every request
app.use(ClerkExpressWithAuth());

// Sync Clerk user to MongoDB and expose res.locals.currentUser to all views
app.use(clerkAuthMiddleware);

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  next();
});

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRoute);
app.use('/', userRouter);

app.use('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Server Error' } = err;
  res.status(statusCode).render('error', { statusCode, message });
});

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to Database');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
}

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port} you can check it at http://localhost:${port}`);
});
