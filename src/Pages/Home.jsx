import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [cookingTimeFilter, setCookingTimeFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();


    // Fetch all recipes on load
    useEffect(() => {
        fetchRecipes();
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('/api/favorites');
            setFavorites(response.data.map(recipe => recipe._id));
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const addToFavorites = async (recipeId) => {
        if (!user) {
            alert('Please login or sign up to add recipes to favorites!');
            return;
        }

        try {
            if (favorites.includes(recipeId)) {
                await axios.delete(`/api/favorites/${recipeId}`);
                setFavorites(favorites.filter(id => id !== recipeId));
                alert('Recipe removed from favorites!');
            } else {
                await axios.post(`/api/favorites/${recipeId}`);
                setFavorites([...favorites, recipeId]);
                alert('Recipe added to favorites!');
            }
        } catch (error) {
            console.error('Error with favorites:', error);
            alert('Error updating favorites. Please try again.');
        }
    };

    const fetchRecipes = async (searchTerm = '', timeFilter = '') => {
        try {
            setLoading(true);
            let url = '/api/recipes';
            const params = new URLSearchParams();
            
            if (searchTerm) {
                // Check if multiple ingredients (comma separated)
                if (searchTerm.includes(',')) {
                    params.append('ingredients', searchTerm);
                } else {
                    params.append('ingredient', searchTerm);
                }
            }
            
            if (timeFilter) {
                params.append('cookingTime', timeFilter);
            }
            
            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await axios.get(url);
            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes(search, cookingTimeFilter);
    };

    const handleTimeFilter = (timeFilter) => {
        setCookingTimeFilter(timeFilter);
        fetchRecipes(search, timeFilter);
    };



    return (
        <div>
            <div className="recipe-search">
                <h1>Find Recipes</h1>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter ingredients (e.g., chicken, tomato or chicken,rice,onion)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
                
                <div className="filters">
                    <div className="time-filters">
                        <button 
                            className={cookingTimeFilter === '' ? 'active' : ''}
                            onClick={() => handleTimeFilter('')}
                        >
                            All Time
                        </button>
                        <button 
                            className={cookingTimeFilter === 'quick' ? 'active' : ''}
                            onClick={() => handleTimeFilter('quick')}
                        >
                            Quick (≤15min)
                        </button>
                        <button 
                            className={cookingTimeFilter === 'medium' ? 'active' : ''}
                            onClick={() => handleTimeFilter('medium')}
                        >
                            Medium (15-60min)
                        </button>
                        <button 
                            className={cookingTimeFilter === 'long' ? 'active' : ''}
                            onClick={() => handleTimeFilter('long')}
                        >
                            Long (60min+)
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : (
                <div className="recipe-grid">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <div className="recipe-card" key={recipe._id}>
                                <div className="recipe-info">
                                    <h3>{recipe.title}</h3>
                                    <div className="recipe-meta">
                                        <span className="cooking-time">⏱️ {recipe.cookingTime || 30} min</span>
                                        <span className="servings">👥 Serves {recipe.servings || 4}</span>
                                    </div>
                                    
                                    <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                                    <div><strong>Instructions:</strong>
                                        <div className="instructions">{recipe.instructions}</div>
                                    </div>
                                    
                                    <button 
                                        className={`fav-btn ${favorites.includes(recipe._id) ? 'added' : ''}`}
                                        onClick={() => addToFavorites(recipe._id)}
                                    >
                                        {favorites.includes(recipe._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%' }}>No recipes found. Try adding some to the database!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
