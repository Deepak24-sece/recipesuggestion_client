import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('/api/favorites');
            setFavorites(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setLoading(false);
        }
    };

    const removeFromFavorites = async (recipeId) => {
        try {
            await axios.delete(`/api/favorites/${recipeId}`);
            setFavorites(favorites.filter(recipe => recipe._id !== recipeId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (!user) {
        return (
            <div className="favorites-container">
                <h2>Please login to view your favorite recipes</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="favorites-container">
                <h2>Loading your favorites...</h2>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h2>My Favorite Recipes ({favorites.length})</h2>
            
            {favorites.length === 0 ? (
                <p>No favorite recipes yet. Start adding some from the home page!</p>
            ) : (
                <div className="recipe-grid">
                    {favorites.map((recipe) => (
                        <div className="recipe-card" key={recipe._id}>
                            <div className="recipe-info">
                                <div className="recipe-header">
                                    <h3>{recipe.title}</h3>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeFromFavorites(recipe._id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="recipe-meta">
                                    <span className="cooking-time">⏱️ {recipe.cookingTime || 30} min</span>
                                    <span className="servings">👥 Serves {recipe.servings || 4}</span>
                                </div>
                                <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                                <div><strong>Instructions:</strong>
                                    <div className="instructions">{recipe.instructions}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;