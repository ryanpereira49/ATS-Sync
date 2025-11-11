import express from 'express';
import 'dotenv/config';
import { db } from './src/db/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello ATS-Sync!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})