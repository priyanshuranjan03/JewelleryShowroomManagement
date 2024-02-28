// // App.jsx
// import React, { useState } from 'react';
// import AuthCard from './components/AuthCard';
// import Dashboard from './components/Dashboard';

// function App() {
//   const [user, setUser] = useState(null);

//   const handleSignIn = (userData) => {
//     // Perform sign-in logic (e.g., API call)
//     // Set user data in state upon successful sign-in
//     setUser(userData);
//   };

//   const handleSignOut = () => {
//     // Perform sign-out logic
//     // Clear user data from state
//     setUser(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {user ? (
//         <Dashboard user={user} onSignOut={handleSignOut} />
//       ) : (
//         <AuthCard onSignIn={handleSignIn} />
//       )}

//     </div>
//   );
// }

// export default App;
// App.jsx or your main routing file
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JewelleryItem from './pages/jewelleryItem';
import AuthCard from './components/AuthCard';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthCard />} />
        <Route path="/jewellery" element={<JewelleryItem />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ... other routes */}
      </Routes>
    </Router>
  );
};

export default App;

