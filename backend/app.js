import express from 'express';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customer.js';

const app = express();

// middleware funnels
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(adminRoutes);
app.use(customerRoutes);

app.listen(3000);
