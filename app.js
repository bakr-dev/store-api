require('dotenv').config();
require('express-async-errors');

// securty packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const reteLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHnadlerMiddleware = require('./middleware/error-handler');
// ===================================
// ===== End of Requires Section =====
// ===================================

// securty packages & midlewares
app.set('trust proxy', 1);
app.use(
  reteLimiter({
    windows: 15 * 60 * 1000, // 15 min
    max: 100, // limit each IP to 100 request per windowsMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// home page
app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1> <a href="/api/v1/products">Products</a>');
});

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter);

// error handlers
app.use(notFoundMiddleware);
app.use(errorHnadlerMiddleware);

const port = 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listing on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
