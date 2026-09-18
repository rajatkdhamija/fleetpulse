import express from "express";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "FleetPulse is alive" });
});

app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`FleetPulse backend running on port ${PORT}`);
});