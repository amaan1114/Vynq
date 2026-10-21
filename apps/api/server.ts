import { app } from "./app.js";
import { config } from "./utils/config.js";
import { connectDB } from "./db/connection.js";

await connectDB();

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
