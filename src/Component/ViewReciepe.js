import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ViewRecipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        setRecipes(storedRecipes);
        const foundRecipe = storedRecipes.find(r => r.id === parseInt(id));
        setRecipe(foundRecipe);
    }, [id]);

    const deleteRecipe = () => {
        const updatedRecipes = recipes.filter(r => r.id !== parseInt(id));
        setRecipes(updatedRecipes);
        localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        toast.error("Recipe deleted.");
        navigate('/');
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedRecipes = recipes.map(r =>
            r.id === parseInt(id) ? { ...r, ...recipe } : r
        );
        setRecipes(updatedRecipes);
        localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        toast.success("Recipe updated successfully!");
        setIsEditing(false);  // Exit editing mode
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (!recipe) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.recipeWrapper}>
                {/* Image and Recipe Info */}
                <div style={styles.recipeContent}>
                    <div style={styles.recipeText}>
                        <h1 style={styles.recipeTitle}>{recipe.title}</h1>
                        <p style={styles.recipeSource}>By WILLIAMS-SONOMA</p>
                        <div style={styles.recipeInfo}>
                            <div style={styles.infoBlock}>
                                <span style={styles.infoValue}>{recipe.ingredients.split(',').length}</span>
                                <span style={styles.infoLabel}>Ingredients</span>
                            </div>
                            <div style={styles.infoBlock}>
                                <span style={styles.infoValue}>{recipe.instructions}</span>
                                <span style={styles.infoLabel}>Instruction</span>
                            </div>
                            <div style={styles.infoBlock}>
                                <span style={styles.infoValue}>{recipe.time}</span>
                                <span style={styles.infoLabel}>Time</span>
                            </div>
                            <div style={styles.infoBlock}>
                                <span style={styles.infoValue}>480</span>
                                <span style={styles.infoLabel}>Calories</span>
                            </div>
                        </div>
                        
                    </div>
                    <div style={styles.recipeImageWrapper}>
                        {recipe.image && <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />}
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <form onSubmit={handleUpdate} style={styles.form}>
                        <h2>Edit Recipe</h2>
                        <input
                            type="text"
                            name="title"
                            value={recipe.title}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <textarea
                            name="ingredients"
                            value={recipe.ingredients}
                            onChange={handleChange}
                            style={styles.textarea}
                            required
                        />
                        <textarea
                            name="instructions"
                            value={recipe.instructions}
                            onChange={handleChange}
                            style={styles.textarea}
                            required
                        />
                        <input
                            type="text"
                            name="cuisine"
                            value={recipe.cuisine}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <input
                            type="number"
                            name="time"
                            value={recipe.time}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <button type="submit" style={styles.submitButton}>Update Recipe</button>
                    </form>
                )}

                <div style={styles.buttonContainer}>
                    <button onClick={toggleEdit} style={styles.editButton}>
                        {isEditing ? 'Cancel' : 'Edit Recipe'}
                    </button>
                    <button onClick={deleteRecipe} style={styles.deleteButton}>Delete Recipe</button>
                </div>
            </div>

            <ToastContainer />
            <Link to="/" style={styles.GobackButton}>Go Back</Link>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeWrapper: {
        maxWidth: '800px',
        width: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        backgroundColor: '#fff',
    },
    GobackButton:{
        backgroundColor: '#FF5722',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '14px',
       textDecoration:"none",
       margin:"0 0 0 15px "
    },
    recipeContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recipeText: {
        flex: '1',
    },
    recipeTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    recipeSource: {
        fontSize: '14px',
        color: '#757575',
        marginBottom: '20px',
    },
    recipeInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '300px',
        marginBottom: '20px',
    },
    infoBlock: {
        textAlign: 'center',
        marginRight:"18px"
    },
    infoValue: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    infoLabel: {
        fontSize: '12px',
        color: '#757575',
        marginLeft:"5px",
    },
    yumButton: {
        display: 'flex',
        alignItems: 'center',
    },
    mealPlannerButton: {
        backgroundColor: '#FF5722',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    recipeImageWrapper: {
        flex: '0 0 300px',
    },
    recipeImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
    },
    form: {
        marginTop: '20px',
        textAlign: 'center',
    },
    input: {
        display: 'block',
        width: '100%',
        maxWidth: '400px',
        margin: '10px auto',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    textarea: {
        display: 'block',
        width: '100%',
        maxWidth: '400px',
        height: '100px',
        margin: '10px auto',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
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
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    editButton: {
        backgroundColor: '#FFA000',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ViewRecipe;
