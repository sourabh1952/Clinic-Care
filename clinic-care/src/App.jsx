import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserSignup from './UserSignup';
import DoctorSignup from './DoctorSignup';
import DoctorLogin from './DoctorLogin';
import UserLogin from './UserLogin';
import Home from './home';

function App() {
  const navigate = useNavigate();

  const navigateToSignup = (role) => {
    navigate(`/${role}-signup`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Select Who You Are</h1>
            <div className="flex space-x-4">
              <div
                className="p-8 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-200 transition"
                onClick={() => navigateToSignup('user')}
              >
                <h2 className="text-2xl">User</h2>
              </div>
              <div
                className="p-8 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-200 transition"
                onClick={() => navigateToSignup('doctor')}
              >
                <h2 className="text-2xl">Doctor</h2>
              </div>
            </div>
          </div>
        }
      />
      <Route path="/user-signup" element={<UserSignup />} />
      <Route path="/doctor-signup" element={<DoctorSignup />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
