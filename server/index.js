const express = require('express');
import { drizzle } from 'drizzle-orm/node-postgres';
const app = express();
const PORT = process.env.PORT || 3000;

const db = drizzle(process.env.DATABASE_URL);

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello ATS-Sync!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})