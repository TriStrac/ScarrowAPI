import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { swaggerSpec } from './utils'
import { errorHandler } from './middlewares';
import userRoutes from "./routes/user.route";
import groupRoutes from "./routes/group.route";
import deviceRoutes from "./routes/device.route";
import userActivityLogRoutes from "./routes/userActivityLog.route";
import deviceLogsRoutes from "./routes/deviceLogs.route";



dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/deviceLogs", deviceLogsRoutes);

app.use("/api/userActivityLogs", userActivityLogRoutes);

app.use('/api-docs', swaggerSpec.serve, swaggerSpec.setup);
app.use(errorHandler);

app.get('/', (_, res) => res.redirect('/api-docs'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))