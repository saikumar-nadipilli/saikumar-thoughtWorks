import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    console.log(storedExpenses);
    setExpenses(storedExpenses);
  }, []);

  const updateLocalStorage = (newExpenses) => {
    localStorage.setItem("expenses", JSON.stringify(newExpenses));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!description || !amount || !date) {
      alert("Please fill out all fields.");
      return;
    }

    const newExpense = { description, amount, date };

    let updatedExpenses;
    if (editingIndex !== null) {
      updatedExpenses = expenses.map((expense, index) =>
        index === editingIndex ? newExpense : expense
      );
      setEditingIndex(null);
    } else {
      updatedExpenses = [...expenses, newExpense];
    }

    setExpenses(updatedExpenses);
    updateLocalStorage(updatedExpenses);

    setDescription("");
    setAmount("");
    setDate("");
  };

  const handleEdit = (index) => {
    const expense = expenses[index];
    setDescription(expense.description);
    setAmount(expense.amount);
    setDate(expense.date);
    setEditingIndex(index);
    window.scrollTo(0, 0);
  };

  const handleDelete = (index) => {
    const updatedExpenses = expenses.filter((expense, i) => {
      if (i !== index) {
        return true;
      } else {
        return false;
      }
    });
    setExpenses(updatedExpenses);
    updateLocalStorage(updatedExpenses);
  };

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  return (
    <div className="container">
      <div className="head-container">
        <h1>Personal Expense Tracker</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">
          {editingIndex !== null ? "Update Expense" : "Add Expense"}
        </button>
      </form>
      <div id="expense-list">
        <p>My Expenses: </p>
        {expenses.length === 0 ? (
          <p>No expenses to display</p>
        ) : (
          expenses.map((expense, index) => (
            <div className="expense-item" key={index}>
              <span className="span-items">
                {new Date(expense.date).toLocaleDateString()} -{" "}
                {expense.description}: Rs.
                {parseFloat(expense.amount).toFixed(2)}{" "}
              </span>
              <div>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(index)}
                >
                  Edit Expense
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleDelete(index)}
                >
                  Delete Expense
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="total-container" id="total-amount">
        Total Amount: Rs.{totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default App;
