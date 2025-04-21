import express from 'express';
import cors from 'cors';
import path from 'path'
import 'dotenv/config';
import connectDB from './config/dbConfig.js';
import authRouter from './routes/authRoutes.js';
import itemRouter from './routes/iemRoutes.js';

const app = express();

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(cors());
app.use(express.json());

app.use('/api', authRouter, itemRouter);

app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});


const PORT = process.env.PORT || 3000
app.listen(PORT,
   () => {
      connectDB();
      console.log(`Server running on port ${PORT}`);
   });