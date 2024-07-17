import { useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import doctorImage from './assets/doctor.jpg'; 
const supabase = createClient("https://qhebmgbtfpnnsdhpgcey.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZWJtZ2J0ZnBubnNkaHBnY2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMTg0NzAsImV4cCI6MjAzNjY5NDQ3MH0.176drkW10Yz_zAwznxirDa4vfLLSmS9MqY50L7lPUK0");
const CDNURL = "https://qhebmgbtfpnnsdhpgcey.supabase.co/storage/v1/object/public/care/";

const ProfileCard = () => {
  const location = useLocation();
  const rowData = location.state; 
  const { _id, username, email, specialty } = location.state || { _id:'',username: '', email: '', specialty: '' };
  
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showUploadPDF, setShowUpPDF] = useState(false);
  const [showUploadpatient, setShowUppatient] = useState(false);

  const [PDF, setPDF] = useState([]);
  const [patientList, setPatientList] = useState([]);

  // Fetch PDF files from Supabase storage
  async function getPDF() {
    const { data, error } = await supabase
      .storage
      .from('care')  // Specify the bucket name
      .list(`${email}/`);

    if (error) {
      console.error(error);
      alert("Error grabbing files from Supabase");
    } else {
      setPDF(data);
    }
  }

  // Fetch patients from backend
  async function getPatients() {
    try {
      const response = await axios.post(`http://localhost:3000/api/getpatients`, {
        _id
      });
      console.log(response.data);
      setPatientList(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      alert('Failed to fetch patients.');
    }
  }

  // Load PDFs and patients on component mount
  useEffect(() => {
    getPDF();
    getPatients();
  }, []);


  // Handle click on "View PDF" button
  const handleViewPDF = () => {
    setShowUppatient(false);
    setShowUpPDF(true);
  };

  const handleViewpatient= () => {
    setShowUpPDF(false);
    setShowUppatient(true);
  };

  const handleUploadClick = () => {
    setShowUploadPopup(true);
  };

  const handleClosePopup = () => {
    setShowUploadPopup(false);
  };

  // Function to upload PDF file to Supabase
  async function uploadFile(e) {
    const pdfFile = e.target.files[0];
    console.log("Upload!");
    const fileName = pdfFile.name;
    console.log("File Name:", fileName);

    const { error } = await supabase.storage
      .from('care')
      .upload(`${email}/${fileName}`, pdfFile); // Upload file in a folder named after email

    if (error) {
      console.log(error);
      alert("Error uploading file to Supabase");
    } else {
      getPDF(); // Refresh PDF list after upload
    }
  }

  return (
    <div className="bg-gray-300 antialiased min-h-screen flex items-center justify-center p-4">
  <div className="bg-white relative shadow rounded-lg w-full max-w-2xl mx-auto">
    <div className="flex justify-center">
      <img
        src={doctorImage}
        alt=""
        className="rounded-full mx-auto absolute -top-12 sm:-top-20 w-24 sm:w-32 h-24 sm:h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"
      />
    </div>
    <div className="mt-16  px-4">
      <h1 className="font-bold text-center text-2xl sm:text-3xl text-gray-900">{username}</h1>
      <div className="my-5 px-6">
        <a
          href="#"
          className="text-gray-200 block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-gray-900 hover:bg-black hover:text-white"
        >
          Speciality : <span className="font-bold">{specialty}</span>
        </a>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center my-5 px-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleUploadClick}
          className="w-full  py-3 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition duration-150"
        >
          Upload PDF
        </button>
        <button
          onClick={handleViewPDF}
          className="w-full  py-3 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition duration-150"
        >
          View PDF
        </button>
        <button 
          onClick={handleViewpatient}
          className="w-full py-3 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition duration-150">
          Patient List
        </button>
      </div>
      {showUploadPDF && PDF.length > 0 && (
        <div className="my-5 px-6">
          <h3 className="font-medium text-gray-900 text-left">PDFs:</h3>
          <ul className="mt-3 space-y-2">
            {PDF.map((pdf, index) => (
              <li key={index}>
                <a
                  href={`${CDNURL}${email}/${encodeURIComponent(pdf.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {pdf.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showUploadpatient && patientList.length > 0 && (
        <div className="my-5 px-6">
        <h3 className="font-medium text-gray-900 text-left">Patients:</h3>
        <div className="mt-3 space-y-4">
          {patientList.map((patient, index) => (
            <div key={patient._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-2">
                <span className="font-bold text-sm md:text-base">Index:</span>{' '}
                <span className="text-gray-700 text-sm md:text-base">{index + 1}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-sm md:text-base">Patient Name:</span>{' '}
                <span className="text-gray-700 text-sm md:text-base font-normal break-all">{patient.name}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-sm md:text-base">Email:</span>{' '}
                <span className="text-gray-700 text-sm md:text-base font-normal break-all">{patient.email}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-sm md:text-base">Description:</span>{' '}
                <span className="text-gray-700 text-sm md:text-base font-normal whitespace-normal break-all">{patient.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      )}
    </div>

    {showUploadPopup && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload PDF</h3>
          <input type="file" className="mb-4" onChange={(e) => uploadFile(e)}/>
          <button
            onClick={handleClosePopup}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default ProfileCard;
