import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Reciept() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [recipeData, setRecipeData] = useState({});
    const [image, setImage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        setRecipes(storedRecipes);
        setFilteredRecipes(storedRecipes);
    }, []);

    useEffect(() => {
        if (recipes.length > 0) {
            localStorage.setItem('recipes', JSON.stringify(recipes));
            setFilteredRecipes(recipes); // Update filtered list
        }
    }, [recipes]);

    const deleteRecipe = (id) => {
        const newRecipes = recipes.filter(recipe => recipe.id !== id);
        setRecipes(newRecipes);
        toast.error("Recipe deleted.");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions || !recipeData.cuisine || !recipeData.time) {
            toast.error("Please fill all fields!");
            return false;
        }
        if (recipeData.time <= 0) {
            toast.error("Cooking time should be a positive number!");
            return false;
        }
        if (!image) {
            toast.error("Please upload an image!");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newRecipe = {
            ...recipeData,
            id: Math.round(Math.random() * 1000),
            image: image,
        };
        setRecipes([...recipes, newRecipe]);
        toast.success("Recipe added successfully!");
        setRecipeData({});
        setImage("");
        e.target.reset();
    };

    const viewRecipe = (id) => {
        navigate(`/viewrecipe/${id}`);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = recipes.filter(recipe =>
            recipe.cuisine.toLowerCase().includes(query) ||
            recipe.ingredients.toLowerCase().includes(query)
        );
        setFilteredRecipes(filtered);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Recipen Card</h1>

         
            

           
            <form onSubmit={handleSubmit} style={styles.form}>
                <table border={1} cellPadding="10px" style={styles.table}>
                    <tbody>
                        <tr>
                            <td>Recipe Title:</td>
                            <td>
                                <input
                                    type="text"
                                    name="title"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    placeholder="Enter recipe title"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Ingredients:</td>
                            <td>
                                <textarea
                                    name="ingredients"
                                    style={styles.textarea}
                                    onChange={handleChange}
                                    required
                                    placeholder="Comma-separated ingredients"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Instructions:</td>
                            <td>
                                <textarea
                                    name="instructions"
                                    style={styles.textarea}
                                    onChange={handleChange}
                                    required
                                    placeholder="Step-by-step instructions"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Cuisine Type:</td>
                            <td>
                                <input
                                    type="text"
                                    name="cuisine"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Italian, Chinese"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Cooking Time (in minutes):</td>
                            <td>
                                <input
                                    type="number"
                                    name="time"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., 30"
                                    min={1}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Recipe Image:</td>
                            <td>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    style={styles.input}
                                    onChange={handleImageUpload}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={styles.submitRow}>
                                <input type="submit" style={styles.submitButton} value="Add Recipe" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            <input
                type="text"
                placeholder="Search by ingredients or cuisine"
                value={searchQuery}
                onChange={handleSearch}
                style={styles.searchBar}
            />
            <div style={styles.recipeList}>
                {filteredRecipes.length === 0 ? (
                    <h3 style={styles.noRecipes}>No recipes found.</h3>
                ) : (
                    filteredRecipes.map((recipe) => (
                        <div key={recipe.id} style={styles.recipeCard}>
                            <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />
                            <h2 style={styles.recipeTitle}>{recipe.title}</h2>
                            <p style={styles.recipeCuisine}>{recipe.cuisine}</p>
                            <div style={styles.recipeTime}>
                                <span>Cooking Time: {recipe.time} mins</span>
                            </div>
                            <div style={styles.ratingContainer}>
                                <span style={styles.rating}>★ ★ ★ ★ ★</span>
                            </div>
                            <button onClick={() => viewRecipe(recipe.id)} style={styles.viewButton}>View Recipe</button>
                        </div>
                    ))
                )}
            </div>

            <ToastContainer />
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    searchBar: {
        display: 'block',
        width: '100%',
        maxWidth: '400px',
        margin: '20px auto',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    form: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#e3f2fd',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    textarea: {
        width: '100%',
        height: '60px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        padding: '10px',
    },
    input: {
        width: '100%',
        height: '35px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        padding: '10px',
    },
    submitRow: {
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    recipeList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '20px',
        marginTop: '20px',
    },
    recipeCard: {
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '230px', 
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    recipeImage: {
        width: '100%',
        height: '140px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    recipeTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    recipeCuisine: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '5px',
    },
    recipeTime: {
        fontSize: '13px',
        color: '#555',
    },
    ratingContainer: {
        marginTop: '10px',
    },
    rating: {
        fontSize: '14px',
        color: '#FFD700',  
    },
    viewButton: {
        backgroundColor: '#FF5722',
        color: '#fff',
        padding: '8px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    noRecipes: {
        textAlign: 'center',
        color: '#999',
    },
};

export default Reciept;
