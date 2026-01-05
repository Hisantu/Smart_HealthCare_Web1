import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import PatientSelector from '../components/PatientSelector';

function TokenGeneration() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [priority, setPriority] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data); // Show all departments, not just open ones
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/tokens', {
        patient: selectedPatient,
        department: selectedDepartment,
        priority
      });
      setGeneratedToken(data);
      setMessage('Token generated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Generate Walk-in Token</h1>
            <p className="text-green-100">Create a new queue token for walk-in patients</p>
          </div>
          
          {generatedToken ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-3xl p-12 mb-8 shadow-2xl"
              >
                <p className="text-2xl mb-4 font-semibold">Token Number</p>
                <h2 className="text-8xl font-bold mb-6">{generatedToken.tokenNumber}</h2>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                  <p className="text-2xl font-semibold mb-2">{generatedToken.patient.name}</p>
                  <p className="text-xl">{generatedToken.department.name}</p>
                </div>
              </motion.div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setGeneratedToken(null); setMessage(''); setSelectedPatient(''); setSelectedDepartment(''); setPriority(false); }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Generate Another Token
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <PatientSelector 
                selectedPatient={selectedPatient}
                onPatientSelect={setSelectedPatient}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Department *</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Choose a department</option>
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name} {d.isOpen === false ? '(Closed)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <motion.label
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-300 transition-all"
              >
                <input
                  type="checkbox"
                  checked={priority}
                  onChange={(e) => setPriority(e.target.checked)}
                  className="w-6 h-6 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
                <div>
                  <span className="font-semibold text-gray-800">Priority Token</span>
                  <p className="text-sm text-gray-600">For elderly, emergency, or special cases</p>
                </div>
              </motion.label>

              {message && !generatedToken && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-red-50 text-red-700"
                >
                  {message}
                </motion.div>
              )}

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Token'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  Back
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default TokenGeneration;
