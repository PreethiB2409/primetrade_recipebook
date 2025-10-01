const express = require("express");
const db = require("../config/db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Create recipe
router.post("/", authMiddleware, (req, res) => {
  const { title, description, ingredients, instructions } = req.body;
  const userId = req.user.id;

  const query = `
    INSERT INTO recipes (user_id, title, description, ingredients, instructions)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [userId, title, description, ingredients, instructions], function (err) {
    if (err) return res.status(500).json({ message: "Error adding recipe" });
    res.json({ id: this.lastID });
  });
});

// Get all recipes for user
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;
  db.all(`SELECT * FROM recipes WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching recipes" });
    res.json(rows);
  });
});

// Delete a recipe
router.delete("/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.id;

  db.run(`DELETE FROM recipes WHERE id = ? AND user_id = ?`, [recipeId, userId], function (err) {
    if (err) return res.status(500).json({ message: "Error deleting recipe" });
    if (this.changes === 0) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;
