import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

export default function App() {
  const [userType, setUserType] = useState(null);
  const [complaints, setComplaints] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUserType={setUserType} />} />
        <Route path="/customer" element={<CustomerPage complaints={complaints} setComplaints={setComplaints} />} />
        <Route path="/admin" element={<AdminPage complaints={complaints} setComplaints={setComplaints} />} />
      </Routes>
    </Router>
  );
}

function LoginPage({ setUserType }) {
  const navigate = useNavigate();

  const handleLogin = (type) => {
    setUserType(type);
    navigate(type === "customer" ? "/customer" : "/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      <h1 className="text-2xl mb-4">College Complaint System</h1>
      <button onClick={() => handleLogin("customer")} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
        Login as Customer
      </button>
      <button onClick={() => handleLogin("admin")} className="bg-red-500 text-white px-4 py-2 rounded">
        Login as Admin
      </button>
    </div>
  );
}

function CustomerPage({ complaints, setComplaints }) {
  const [category, setCategory] = useState("Canteen");
  const [description, setDescription] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  const submitComplaint = () => {
    const newComplaint = { category, description, isEmergency, status: "Pending", history: ["Complaint Submitted"] };
    setComplaints([...complaints, newComplaint]);
  };

  return (
    <div className="min-h-screen w-full p-4 bg-gray-100 flex flex-col items-center">
      <h2 className="text-xl mb-4">Post a Complaint</h2>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 mb-2 w-full max-w-md">
        <option>Canteen</option>
        <option>Management</option>
        <option>Lost & Found</option>
      </select>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue" className="border p-2 w-full max-w-md mb-2"></textarea>
      <label className="flex items-center mb-2">
        <input type="checkbox" checked={isEmergency} onChange={() => setIsEmergency(!isEmergency)} className="mr-2" /> Mark as Emergency
      </label>
      <button onClick={submitComplaint} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
      
      <h2 className="text-xl mt-6">Your Complaints</h2>
      {complaints.map((comp, index) => (
        <div key={index} className={`border p-4 mb-2 w-full max-w-md shadow-md ${comp.status === 'Solved' ? 'bg-green-300' : 'bg-white'}`}>
          <p><strong>Category:</strong> {comp.category}</p>
          <p><strong>Description:</strong> {comp.description}</p>
          <p><strong>Emergency:</strong> {comp.isEmergency ? "Yes" : "No"}</p>
          <p><strong>Status:</strong> {comp.status}</p>
          <p><strong>History:</strong> {comp.history.join(" → ")}</p>
        </div>
      ))}
    </div>
  );
}

function AdminPage({ complaints, setComplaints }) {
  const categories = ["Canteen", "Management", "Lost & Found"];
  const [selectedCategory, setSelectedCategory] = useState(null);

  const updateStatus = (index, newStatus) => {
    const updatedComplaints = complaints.map((comp, i) => {
      if (i === index) {
        return { ...comp, status: newStatus, history: [...comp.history, `Marked as ${newStatus}`] };
      }
      return comp;
    });
    setComplaints(updatedComplaints);
  };

  return (
    <div className="min-h-screen w-full p-4 bg-gray-100 flex flex-col items-center">
      <h2 className="text-xl mb-4">Admin Panel</h2>
      <div className="grid grid-cols-3 gap-6 mb-4">
        {categories.map((category) => (
          <div key={category} 
               className="border p-12 bg-white shadow-md text-center rounded-lg cursor-pointer"
               onClick={() => setSelectedCategory(category)}>
            <h3 className="text-lg font-bold">{category}</h3>
            <p className="text-red-500">{complaints.filter(comp => comp.category === category && comp.status !== 'Solved').length} complaints</p>
          </div>
        ))}
      </div>
    </div>
  );
}
