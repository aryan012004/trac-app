import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

function ViewAllExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedExpense, setEditedExpense] = useState({});
    const [filters, setFilters] = useState({
        category: "",
        paymentMethod: "",
        startDate: "",
        endDate: "",
        searchQuery: "",
    });
    const [sortField, setSortField] = useState("date");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(storedExpenses);
    }, []);

    const deleteExpense = (id) => {
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    };

    const saveEdit = (id) => {
        const updatedExpenses = expenses.map(expense => expense.id === id ? editedExpense : expense);
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setEditId(null);
    };

    const handleSort = (field) => {
        const direction = sortDirection === "asc" ? "desc" : "asc";
        const sortedExpenses = [...expenses].sort((a, b) => {
            if (field === "amount") return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
            if (field === "date") return direction === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            if (field === "category") return direction === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
        });
        setSortField(field);
        setSortDirection(direction);
        setExpenses(sortedExpenses);
    };

    const applyFilters = (expense) => {
        const { category, paymentMethod, startDate, endDate, searchQuery } = filters;
        const matchCategory = category ? expense.category === category : true;
        const matchPaymentMethod = paymentMethod ? expense.paymentMethod === paymentMethod : true;
        const matchDateRange = startDate && endDate ? new Date(expense.date) >= new Date(startDate) && new Date(expense.date) <= new Date(endDate) : true;
        const matchSearch = searchQuery ? expense.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchCategory && matchPaymentMethod && matchDateRange && matchSearch;
    };

    const filteredExpenses = expenses.filter(applyFilters);
    const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

    const expenseByMonth = expenses.reduce((acc, expense) => {
        const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) acc[month] = 0;
        acc[month] += Number(expense.amount);
        return acc;
    }, {});

    const monthlyData = Object.keys(expenseByMonth).map(month => ({
        month,
        amount: expenseByMonth[month]
    }));

    const categoryData = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) acc[expense.category] = 0;
        acc[expense.category] += Number(expense.amount);
        return acc;
    }, {});

    const pieData = Object.keys(categoryData).map(category => ({
        name: category,
        value: categoryData[category]
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>All Expenses</h1>

            <button onClick={() => navigate("/")} style={styles.backButton}>
                Back to Expense Tracker
            </button>

            <h2 style={styles.filterTitle}>Filter Expenses</h2>
            <div style={styles.filtersContainer}>
                <input
                    type="text"
                    placeholder="Search description..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    style={styles.input}
                />
                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    style={styles.input}
                >
                    <option value="">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                </select>
                <select
                    value={filters.paymentMethod}
                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                    style={styles.input}
                >
                    <option value="">All Payment Methods</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                </select>
            </div>

            <div style={styles.chartContainer}>
                <h3>Monthly Expense Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>

                <h3>Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {paginatedExpenses.length > 0 ? (
                <table style={styles.expenseTable}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("amount")}>Amount</th>
                            <th>Description</th>
                            <th onClick={() => handleSort("date")}>Date</th>
                            <th onClick={() => handleSort("category")}>Category</th>
                            <th>Payment Method</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedExpenses.map((expense) => (
                            <tr key={expense.id}>
                                {editId === expense.id ? (
                                    <>
                                        <td><input type="number" value={editedExpense.amount} onChange={(e) => setEditedExpense({ ...editedExpense, amount: e.target.value })} /></td>
                                        <td><input type="text" value={editedExpense.description} onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })} /></td>
                                        <td><input type="date" value={editedExpense.date} onChange={(e) => setEditedExpense({ ...editedExpense, date: e.target.value })} /></td>
                                        <td><input type="text" value={editedExpense.category} onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })} /></td>
                                        <td><input type="text" value={editedExpense.paymentMethod} onChange={(e) => setEditedExpense({ ...editedExpense, paymentMethod: e.target.value })} /></td>
                                        <td>
                                            <button onClick={() => saveEdit(expense.id)} style={styles.saveButton}>Save</button>
                                            <button onClick={() => setEditId(null)} style={styles.cancelButton}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{expense.amount}</td>
                                        <td>{expense.description}</td>
                                        <td>{expense.date}</td>
                                        <td>{expense.category}</td>
                                        <td>{expense.paymentMethod}</td>
                                        <td>
                                            <button onClick={() => {
                                                setEditId(expense.id);
                                                setEditedExpense(expense);
                                            }} style={styles.editButton}>Edit</button>
                                            <button onClick={() => deleteExpense(expense.id)} style={styles.deleteButton}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={styles.noExpensesText}>No expenses found.</p>
            )}

            {totalPages > 1 && (
                <div style={styles.paginationContainer}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            style={{
                                ...styles.pageButton,
                                ...(currentPage === index + 1 ? styles.activePageButton : {})
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
    },
    title: {
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '30px',
        fontWeight: '600',
    },
    filterTitle: {
        textAlign: 'center',
        fontSize: '1.5rem',
        color: '#007BFF',
        marginBottom: '20px',
        fontWeight: '500',
    },
    backButton: {
        display: 'block',
        margin: '20px auto',
        padding: '12px 24px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    filtersContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '15px',
        marginBottom: '20px',
    },
    input: {
        flex: '1 1 200px',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
    },
    chartContainer: {
        marginBottom: '40px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fafafa',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    expenseTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    pageButton: {
        padding: '10px',
        margin: '0 5px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    activePageButton: {
        backgroundColor: '#0056b3',
    },
    editButton: {
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '8px',
    },
    deleteButton: {
        backgroundColor: '#FF4D4D',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    saveButton: {
        backgroundColor: '#28A745',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#6C757D',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    noExpensesText: {
        textAlign: 'center',
        color: '#333',
        fontSize: '1.2rem',
        marginTop: '20px',
    },
};

export default ViewAllExpenses;
