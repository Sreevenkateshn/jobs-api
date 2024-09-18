require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const xssclean = require('xss-clean');
const cors = require('cors');
const expressRateLimiter = require('express-rate-limit');

//Swagger

const swaggerUI=require('swagger-ui-express');
const YAML=require('yamljs');
const swaggerDocument = YAML.load('./jobsapi.yaml');

const express = require('express');
const app = express();
//connect db
const connectDb = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
//routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.set('trust proxy', 1 /* number of proxies between user and server */)

app.use(expressRateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
}));
app.use(helmet());
app.use(xssclean());
app.use(cors());

app.use(express.json());//load this middle ware first since we need requests and responses to be sent in json
app.use('/api-use/',swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/', (req, res)=>{
  console.log('am i here');
  res.send('<h1>jobs api</h1><a href="/api-use">Documentation</a>');
})
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// extra packages
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
