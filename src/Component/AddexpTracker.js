import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddexpTracker() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [expenseData, setExpenseData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Fetch stored expenses from localStorage
    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(storedExpenses);
        setFilteredExpenses(storedExpenses);
    }, []);

    // Save expenses to localStorage when updated
    useEffect(() => {
        if (expenses.length > 0) {
            localStorage.setItem('expenses', JSON.stringify(expenses));
            setFilteredExpenses(expenses);
        }
    }, [expenses]);

    // Delete expense
    const deleteExpense = (id) => {
        const newExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(newExpenses);
        toast.error("Expense deleted.");
    };

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    // Form validation
    const validateForm = () => {
        const { amount, date, category, paymentMethod } = expenseData;

        if (!amount || isNaN(amount)) {
            toast.error("Amount must be a valid number!");
            return false;
        }
        if (!date || isNaN(new Date(date).getTime())) {
            toast.error("Please enter a valid date!");
            return false;
        }
        if (!category || !paymentMethod) {
            toast.error("Please fill all fields!");
            return false;
        }
        return true;
    };
    const viewAllExpenses = () => {
        navigate("/viewallexpenses");
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newExpense = {
            ...expenseData,
            id: Math.round(Math.random() * 1000),
        };
        setExpenses([...expenses, newExpense]);
        toast.success("Expense added successfully!");
        setExpenseData({});
        e.target.reset();
    };


    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Expense Tracker</h1>

            <button onClick={viewAllExpenses} style={styles.viewExpensesButton}>
                View All Expenses
            </button>

            {/* Expense Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <table style={styles.table}>
                    <tbody>
                        <tr>
                            <td style={styles.label}>Amount:</td>
                            <td>
                                <input
                                    type="text"
                                    name="amount"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter amount"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Description:</td>
                            <td>
                                <input
                                    type="text"
                                    name="description"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter description"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Date:</td>
                            <td>
                                <input
                                    type="date"
                                    name="date"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Category:</td>
                            <td>
                                <input
                                    type="text"
                                    name="category"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Food, Transport"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.label}>Payment Method:</td>
                            <td>
                                <select
                                    name="paymentMethod"
                                    style={styles.input}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select payment method</option>
                                    <option value="cash">Cash</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={styles.submitRow}>
                                <input type="submit" style={styles.submitButton} value="Add Expense" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {/* Expense List (Can be enhanced with sorting, filtering, pagination, and inline editing) */}
            <table style={styles.expenseTable}>
                <thead>
                    <tr>
                      
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Payment Method</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map((expense) => (
                        <tr key={expense.id}>
                            
                            <td>{expense.amount}</td>
                            <td>{expense.description}</td>
                            <td>{expense.date}</td>
                            <td>{expense.category}</td>
                            <td>{expense.paymentMethod}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

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
    viewExpensesButton: {
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
    expenseTable: {
        width: '100%',
        marginTop: '20px',
        borderCollapse: 'collapse',
    },
    expenseRow: {
        borderBottom: '1px solid #ccc',
    },
};

export default AddexpTracker;
