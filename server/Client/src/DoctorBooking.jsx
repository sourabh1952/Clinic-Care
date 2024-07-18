// src/pages/bookdoctor.jsx
import React, { useState, useEffect , useRef} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';


const DoctorBooking = ({ selectedDoctor, setSelectedDoctor, doctors }) => {
  const [showList, setShowList] = useState(false);
  const dropdownRef = useRef(null);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowList(false);
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setShowList(!showList)}
      >
        {selectedDoctor ? `${selectedDoctor.username} (${selectedDoctor.specialty})` : 'Select a doctor'}
      </button>
      {showList && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {doctors.map((doctor) => (
            <li
              key={doctor._id}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleDoctorClick(doctor)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700"><span className="font-bold">Name : </span> {doctor.username}</p>
                  <p className="text-xs text-gray-700"><span className="font-bold">Specialty : </span>{doctor.specialty}</p>
                </div>
                {selectedDoctor?._id === doctor._id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a1 1 0 0 1-.707-.293l-7-7a1 1 0 0 1 1.414-1.414L10 15.586l8.293-8.293a1 1 0 0 1 1.414 1.414l-9 9a1 1 0 0 1-.707.293z"
                    />
                  </svg>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const BookDoctor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctors from backend
    axios.post('http://localhost:3000/api/doctors')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        alert('Failed to fetch doctors.');
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      alert('Please select a doctor');
      return;
    }

    const bookingData = {
      doctorId: selectedDoctor._id,
      email,
      name,
      description
    };

    axios.post('http://localhost:3000/api/patients', bookingData)
      .then(response => {
        alert('Booking successful! soon you recive a email for your appointment');
        // console.log('Booking response:', response.data);
        navigate(`/`);
        // Implement any additional logic after booking, e.g., redirect to a confirmation page
      })
      .catch(error => {
        console.error('Error booking doctor:', error);
        alert('Failed to book doctor.');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Book a Doctor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description of your disease
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select a Doctor</label>
            <DoctorBooking selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} doctors={doctors} />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Book Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookDoctor;
