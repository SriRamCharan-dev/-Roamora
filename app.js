const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 5000;
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
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const verified = 'my-secret-token';
function verifyToken(req, res, next) {
  const { token } = req.query;
  if (token === verified) return next();
  return next(new ExpressError(401, 'ACCESS DENIED!'));
}
const sessionoptions = {
  secret: 'mysupersecretstring',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  }
}
//these should be declared before the routes
app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

app.use('/api', verifyToken);
app.use(cookieParser('your-secret-string')); // Use any random secret string
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      // Find user by Google ID
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // If not found, check if a user with the same email already exists
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
          user = await User.findOne({ email: email });
        }
        
        if (user) {
          // Link Google ID to existing account
          user.googleId = profile.id;
          await user.save();
        } else {
          // Create new user account
          user = new User({
            username: profile.displayName || (email ? email.split('@')[0] : `google-${profile.id}`),
            email: email,
            googleId: profile.id
          });
          await user.save();
        }
      }
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));

app.get('/api', (req, res) => {
  res.send('data');
});

app.get('/admin', (req, res, next) => {
  throw new ExpressError(402, 'Access forbidden');
});

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRoute);
app.use('/', userRouter);

app.use('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Server Error' } = err;
  res.status(statusCode).send(`<h1>${statusCode}</h1><p>${message}</p>`);
});

async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database error:', err.message);
  }
}


connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port} you can check it at http://localhost:${port}`);
});
