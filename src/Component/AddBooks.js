import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddEBooks() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [bookData, setBookData] = useState({});
    const [image, setImage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        setBooks(storedBooks);
        setFilteredBooks(storedBooks);
    }, []);

    useEffect(() => {
        if (books.length > 0) {
            localStorage.setItem('books', JSON.stringify(books));
            setFilteredBooks(books);
        }
    }, [books]);

    const deleteBook = (id) => {
        const newBooks = books.filter(book => book.id !== id);
        setBooks(newBooks);
        toast.error("eBook deleted.");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
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
        if (!bookData.title || !bookData.author || !bookData.genre || !bookData.publicationDate) {
            toast.error("Please fill all fields!");
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

        const newBook = {
            ...bookData,
            id: Math.round(Math.random() * 1000),
            image: image,
            borrowed: false,
        };
        setBooks([...books, newBook]);
        toast.success("eBook added successfully!");
        setBookData({});
        setImage("");
        e.target.reset();
    };

    const viewBook = (id) => {
        navigate('/viewbook/${id');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Add eBook to Library</h1>
            <button onClick={() => navigate("/")} style={styles.viewBooksButton}>
                View All eBooks
            </button>

            <form onSubmit={handleSubmit} style={styles.form}>
                <table style={styles.table}>
                    <tbody>
                        <tr>
                            <td style={styles.label}>eBook Title:</td>
                            <td>
                                <input
                                    type="text"
                                    name="title"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    placeholder="Enter eBook title"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Author:</td>
                            <td>
                                <input
                                    type="text"
                                    name="author"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter author name"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Genre:</td>
                            <td>
                                <input
                                    type="text"
                                    name="genre"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Fiction, Mystery"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Book Details:</td>
                            <td>
                                <input
                                    type="text"
                                    name="detail"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter brief details"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Publication Date:</td>
                            <td>
                                <input
                                    type="date"
                                    name="publicationDate"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>eBook Cover Image:</td>
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
                                <input type="submit" style={styles.submitButton} value="Add eBook" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            <ToastContainer />
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    },
    viewBooksButton: {
        display: 'block',
        margin: '20px auto',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    form: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    },
    table: {
        width: '100%',
    },
    label: {
        padding: '10px',
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        marginBottom: '15px',
    },
    submitRow: {
        textAlign: 'center',
    },
    submitButton: {
        padding: '10px 25px',
        backgroundColor: '#28A745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default AddEBooks;       