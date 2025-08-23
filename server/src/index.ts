import cors from 'cors';
import express from 'express';
import http from 'http';

import router from './router.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use('/api', router);

const server = http.createServer(app);

server.listen(4000, () => console.log('Server is up and listening...'));
