import { httpServer } from "./app.js";
import { config } from "./utils/config.js";
import { connectDB } from "./db/connection.js";
import './socket.js'

await connectDB();

httpServer.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
