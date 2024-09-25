import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Book() {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({
        genre: '',
        author: '',
        publicationDate: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        setBooks(storedBooks);
    }, []);

    const toggleBorrow = (id) => {
        const updatedBooks = books.map(book => {
            if (book.id === id) {
                book.borrowed = !book.borrowed;
            }
            return book;
        });
        setBooks(updatedBooks);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        toast.success(`Book ${updatedBooks.find(b => b.id === id).borrowed ? "borrowed" : "returned"} successfully!`);
    };

    const viewBook = (id) => {
        navigate(`/viewbook/${id}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredBooks = books.filter((book) => {
        const matchesGenre = filters.genre === '' || book.genre.toLowerCase().includes(filters.genre.toLowerCase());
        const matchesAuthor = filters.author === '' || book.author.toLowerCase().includes(filters.author.toLowerCase());
        const matchesDate = filters.publicationDate === '' || book.publicationDate === filters.publicationDate;
        return matchesGenre && matchesAuthor && matchesDate;
    });

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Explore Our Collection</h1>

            {/* Filters Section */}
            <div style={styles.filtersContainer}>
                <input
                    type="text"
                    name="genre"
                    placeholder="Filter by Genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                    style={styles.filterInput}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Filter by Author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    style={styles.filterInput}
                />
                <input
                    type="date"
                    name="publicationDate"
                    value={filters.publicationDate}
                    onChange={handleFilterChange}
                    style={styles.filterInput}
                />
            </div>

            {/* Book Grid */}
            <div style={styles.bookGrid}>
                {filteredBooks.length === 0 ? (
                    <h3 style={styles.noBooks}>No eBooks found.</h3>
                ) : (
                    filteredBooks.map((book) => (
                        <div key={book.id} style={styles.bookCard}>
                            <img src={book.image} alt={book.title} style={styles.bookImage} />
                            <h2 style={styles.bookTitle}>{book.title}</h2>
                            <p style={styles.bookAuthor}>by {book.author}</p>
                            <p style={styles.bookDescription}>{book.detail}</p>
                            <div style={styles.borrowContainer}>
                                <button
                                    onClick={() => toggleBorrow(book.id)}
                                    style={styles.borrowButton}
                                >
                                    {book.borrowed ? "Return" : "Borrow"}
                                </button>
                                <button onClick={() => viewBook(book.id)} style={styles.viewButton}>View Details</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Link to="/addbook" style={styles.addBookLink}>Add Books</Link>
            <ToastContainer />
        </div>
    );
}

const styles = {
    container: {
        padding: '50px 20px',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
    },
    title: {
        textAlign: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '40px',
        letterSpacing: '1px',
    },
    filtersContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px',
    },
    filterInput: {
        padding: '10px',
        fontSize: '16px',
        width: '200px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    bookGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '30px',
        padding: '0 40px',
    },
    bookCard: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        textAlign: 'center',
    },
    bookImage: {
        width: '100%',
        height: '350px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '15px',
    },
    bookTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#333',
    },
    bookAuthor: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '10px',
    },
    bookDescription: {
        fontSize: '14px',
        color: '#777',
        marginBottom: '20px',
    },
    borrowContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
    },
    borrowButton: {
        backgroundColor: '#2196F3',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        flex: 1,
        marginRight: '10px',
        transition: 'background-color 0.3s ease',
    },
    viewButton: {
        backgroundColor: '#FF5722',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        flex: 1,
        transition: 'background-color 0.3s ease',
    },
    noBooks: {
        textAlign: 'center',
        color: '#999',
        fontSize: '18px',
    },
    addBookLink: {
        display: 'block',
        textAlign: 'center',
        marginTop: '40px',
        color: '#2196F3',
        textDecoration: 'none',
        fontSize: '18px',
    },
};

export default Book;
