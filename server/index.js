import express from 'express';
import 'dotenv/config';
import userRoutes from './src/routes/user.routes.js';
import profileRoutes from './src/routes/profile.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/v1/hello', (req, res) => {
  res.send('Hello ATS-Sync!');
});

//Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', profileRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})