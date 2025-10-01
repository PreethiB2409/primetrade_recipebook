import { useState } from "react";

export default function RecipeCard({ recipe, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="recipe-card" onClick={() => setExpanded(!expanded)}>
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>

      {expanded && (
        <div className="recipe-details">
          <h4>Ingredients</h4>
          <p>{recipe.ingredients}</p>
          <h4>Instructions</h4>
          <p>{recipe.instructions}</p>
          <button onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}>Delete</button>
        </div>
      )}
    </div>
  );
}
