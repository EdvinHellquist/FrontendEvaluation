import express from "express";
import helmet from 'helmet';
import authRouter from "./src/routes/authRoutes.js"
import productRouter from "./src/routes/productRoutes.js";
import cors from 'cors'
import searchRouter from "./src/routes/searchRoutes.js";
import contactRouter from "./src/routes/contactRoutes.js";


const app = express()
const port = 3004
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/auth', authRouter)
app.use('/shop', productRouter)
app.use('/search', searchRouter)
app.use('/contact', contactRouter)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted.cdn.com"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://images.example.com"], 
        fontSrc: ["'self'", "https://fonts.gstatic.com"], 
        connectSrc: ["'self'", "http://localhost:5173", "http://zap.proxy.local", "http://127.0.0.1:8080"], 
        objectSrc: ["'none'"], 
        frameAncestors: ["'self'"], 
        formAction: ["'self'", "http://localhost:5173"], 
        upgradeInsecureRequests: [],
      },
    },
  })
)

app.use((req, res, next) => {
  res.removeHeader('Server');
  next();
});
app.get('/', (req, res) => {
  res.send('Hello World');
})
app.listen(port, () => {
  console.log(`App listnening on port ${port}`)
})