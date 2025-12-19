import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        cookingTime: '',
        servings: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchRecipes();
    }, [navigate]);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('/api/admin/recipes');
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecipe) {
                await axios.put(`/api/admin/recipes/${editingRecipe._id}`, formData);
                alert('Recipe updated successfully!');
            } else {
                await axios.post('/api/admin/recipes', formData);
                alert('Recipe added successfully!');
            }
            
            setFormData({ title: '', ingredients: '', instructions: '', cookingTime: '', servings: '' });
            setShowAddForm(false);
            setEditingRecipe(null);
            fetchRecipes();
        } catch (error) {
            alert('Error saving recipe: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setFormData({
            title: recipe.title,
            ingredients: recipe.ingredients.join(', '),
            instructions: recipe.instructions,
            cookingTime: recipe.cookingTime,
            servings: recipe.servings
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await axios.delete(`/api/admin/recipes/${id}`);
                alert('Recipe deleted successfully!');
                fetchRecipes();
            } catch (error) {
                alert('Error deleting recipe');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-actions">
                    <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
                        {showAddForm ? 'Cancel' : 'Add New Recipe'}
                    </button>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            {showAddForm && (
                <div className="recipe-form">
                    <h3>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Recipe Title:</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ingredients (comma separated):</label>
                            <textarea
                                value={formData.ingredients}
                                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                                required
                                placeholder="chicken, rice, onion, spices"
                            />
                        </div>
                        <div className="form-group">
                            <label>Instructions:</label>
                            <textarea
                                value={formData.instructions}
                                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                                required
                                placeholder="• Step 1\n• Step 2\n• Step 3"
                                rows="6"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Cooking Time (minutes):</label>
                                <input
                                    type="number"
                                    value={formData.cookingTime}
                                    onChange={(e) => setFormData({...formData, cookingTime: e.target.value})}
                                    placeholder="30"
                                />
                            </div>
                            <div className="form-group">
                                <label>Servings:</label>
                                <input
                                    type="number"
                                    value={formData.servings}
                                    onChange={(e) => setFormData({...formData, servings: e.target.value})}
                                    placeholder="4"
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">
                            {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
                        </button>
                    </form>
                </div>
            )}

            <div className="recipes-list">
                <h3>All Recipes ({recipes.length})</h3>
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="admin-recipe-card">
                            <h4>{recipe.title}</h4>
                            <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                            <p><strong>Time:</strong> {recipe.cookingTime} min | <strong>Serves:</strong> {recipe.servings}</p>
                            <div className="recipe-actions">
                                <button onClick={() => handleEdit(recipe)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(recipe._id, recipe.title)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;