import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ViewBook() {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBook, setEditedBook] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        const selectedBook = storedBooks.find((book) => book.id === parseInt(id));
        setBook(selectedBook);
        setEditedBook(selectedBook); // Initialize editedBook
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = () => {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        const updatedBooks = storedBooks.map((b) => (b.id === parseInt(id) ? editedBook : b));
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        setBook(editedBook);
        setIsEditing(false);
        toast.success("Book details updated successfully!");
    };

    const handleDelete = () => {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        const updatedBooks = storedBooks.filter((b) => b.id !== parseInt(id));
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        toast.success("Book deleted successfully!");
        navigate('/'); // Redirect to home after deleting
    };

    if (!book) {
        return <h3 style={{ textAlign: "center", color: "#999" }}>Book not found.</h3>;
    }

    return (
        <div style={styles.container}>
            {isEditing ? (
                <>
                    <h1 style={styles.title}>Edit Book Details</h1>
                    <input
                        type="text"
                        name="title"
                        value={editedBook.title}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Title"
                    />
                    <input
                        type="text"
                        name="author"
                        value={editedBook.author}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Author"
                    />
                    <input
                        type="text"
                        name="genre"
                        value={editedBook.genre}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Genre"
                    />
                    <input
                        type="date"
                        name="publicationDate"
                        value={editedBook.publicationDate}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                    <textarea
                        name="detail"
                        value={editedBook.detail}
                        onChange={handleInputChange}
                        style={styles.textarea}
                        placeholder="Book Description"
                    />
                    <div style={styles.buttonContainer}>
                        <button onClick={handleSaveEdit} style={styles.saveButton}>Save</button>
                        <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <h1 style={styles.title}>{book.title}</h1>
                    <img src={book.image} alt={book.title} style={styles.bookImage} />
                    <p style={styles.bookAuthor}><strong>Author:</strong> {book.author}</p>
                    <p style={styles.bookGenre}><strong>Genre:</strong> {book.genre}</p>
                    <p style={styles.bookDate}><strong>Published:</strong> {new Date(book.publicationDate).toDateString()}</p>
                    <p style={styles.bookDescription}><strong>Description:</strong> {book.detail}</p>
                    <p style={{ ...styles.bookBorrowed, color: book.borrowed ? 'red' : 'green' }}>
                        <strong>Status:</strong> {book.borrowed ? "Currently Borrowed" : "Available"}
                    </p>

                    <div style={styles.actionsContainer}>
                        <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                            <i className="bi bi-pencil-square"></i> 
                        </button>
                        <button style={styles.deleteButton} onClick={handleDelete}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    bookImage: {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    bookAuthor: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    bookGenre: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    bookDate: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    bookDescription: {
        fontSize: '16px',
        marginBottom: '20px',
    },
    bookBorrowed: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        height: '100px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    actionsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    editButton: {
        backgroundColor: '#2196F3',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ViewBook;
