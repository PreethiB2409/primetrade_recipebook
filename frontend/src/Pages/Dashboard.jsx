import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import RecipeCard from "../Components/RecipeCard";

export default function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", ingredients: "", instructions: "" });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadRecipes = async () => {
    try {
      const res = await API.get("/recipes");
      setRecipes(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const addRecipe = async (e) => {
    e.preventDefault();
    await API.post("/recipes", form);
    setForm({ title: "", description: "", ingredients: "", instructions: "" });
    loadRecipes();
  };

  const deleteRecipe = async (id) => {
    await API.delete(`/recipes/${id}`);
    loadRecipes();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Recipe Book</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={addRecipe} className="add-recipe-form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <textarea
          placeholder="Ingredients"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          required
        />
        <textarea
          placeholder="Instructions"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          required
        />
        <button>Add Recipe</button>
      </form>

      <div className="recipe-grid">
        {filtered.map((r) => (
          <RecipeCard key={r.id} recipe={r} onDelete={deleteRecipe} />
        ))}
      </div>
    </div>
  );
}
