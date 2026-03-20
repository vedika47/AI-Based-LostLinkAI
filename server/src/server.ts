import app from "./app";
import dotenv from "dotenv";

dotenv.config();
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'YES - value exists' : 'NO - MISSING or empty');
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
const PORT = process.env.PORT || 5000;
async function main() {
  app.listen(PORT, () => {
    console.log("port", PORT);
  });
}

main();
