import express from "express";
import cors from 'cors';
import { backendScripts } from "@org/backend/scripts"

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// Use the CORS middleware to enable cross-origin requests
app.use(cors());

app.get("/", (req, res) => {

  // readDirectory(dir)
  res.send({ message: "Hello API ssss" + backendScripts() });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
