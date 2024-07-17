import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios'; // Updated to use ES module import
 
const DoctorSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/doctorsignup', {
        username,
        email,
        specialty,
        password,
      });
      
      console.log(response.data);
      navigate(`/doctor-login`);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to sign up');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Doctor Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-gray-700">Specialty</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your specialty"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Sign Up
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex flex-wrap md:flex-nowrap items-center">
              <p className="mr-2 mb-0">Already have an account?</p>
              <Link to="/doctor-login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </div>
      </div>
    </div>
  );
};

export default DoctorSignUp;
