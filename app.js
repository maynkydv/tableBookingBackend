const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

const connectDB = async () => {
  try {
    // await sequelize.sync();
    await sequelize.sync({ alter: true });
    console.log('Database Connected');
  } catch (error) {
    console.log(error);
  }
};

app.get('/', (req, res) => { return res.send('working'); });

const PORT = 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server Started on PORT ${PORT} , http://localhost:${PORT}/`);
});
