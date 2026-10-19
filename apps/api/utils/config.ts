import dotenv from "dotenv";

dotenv.config();

export const config = {
    //Port Setup
    PORT: process.env.PORT || 8080,
    
}