import { useState } from "react";
import "./App.css"; // we'll add styles here

const API_URL = import.meta.env.VITE_API_URL;



function App() {
  const [amount, setAmount] = useState("");
  const [friends, setFriends] = useState([{ name: "", contact: "" }]);
  const [result, setResult] = useState([]);

  const handleFriendChange = (index, field, value) => {
    const updated = [...friends];
    updated[index][field] = value;
    setFriends(updated);
  };

  const addFriendField = () => {
    setFriends([...friends, { name: "", contact: "" }]);
  };

  const handleSplit = async () => {
    try {
      const response = await fetch(`${API_URL}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          friends: friends.filter(f => f.name.trim() !== "" && f.contact.trim() !== "")
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Fair Share and Notify</h1>

      <div className="input-section">
        <input
          type="number"
          placeholder="Enter total amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <h3>Friends:</h3>
        {friends.map((friend, index) => (
          <div key={index} className="friend-input">
            <input
              type="text"
              placeholder={`Friend ${index + 1} Name`}
              value={friend.name}
              onChange={e => handleFriendChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={friend.contact}
              onChange={e => handleFriendChange(index, "contact", e.target.value)}
            />
          </div>
        ))}
        <button onClick={addFriendField}>+ Add Friend</button>
      </div>

      <button className="split-btn" onClick={handleSplit}>Split</button>

      <div className="result-grid">
        {result.map((r, i) => (
          <div key={i} className="result-card">
            <h4>{r.name} ({r.contact})</h4>
            <p>Owes ₹{r.owes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;