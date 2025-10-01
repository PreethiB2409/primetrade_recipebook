const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
require("./models/init"); // create tables if not exist

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
