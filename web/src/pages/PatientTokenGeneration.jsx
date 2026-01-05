import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

function PatientTokenGeneration({ user, onBack, onTokenGenerated }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [priority, setPriority] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
    // Auto-check priority for elderly patients (65+)
    if (user.age >= 65) {
      setPriority(true);
    }
  }, [user.age]);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data);
    } catch (error) {
      setMessage('Failed to load departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const { data } = await api.post('/tokens', {
        patient: user._id || user.id,
        department: selectedDepartment,
        priority
      });
      setGeneratedToken(data);
      // Call the callback to refresh tokens in parent component
      if (onTokenGenerated) {
        onTokenGenerated();
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  if (generatedToken) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-3xl p-8 mb-6 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">Your Token</h2>
          <div className="text-6xl font-bold mb-4">{generatedToken.tokenNumber}</div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xl font-semibold">{generatedToken.department.name}</p>
            {priority && <p className="text-sm mt-2">⭐ Priority Token</p>}
          </div>
        </motion.div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-gray-700 mb-2">
            <strong>Please note your token number and wait for it to be called.</strong>
          </p>
          <p className="text-sm text-gray-600">
            You can check the display board for queue status or return to your dashboard.
          </p>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setGeneratedToken(null);
              setSelectedDepartment('');
              setMessage('');
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Generate Another
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onBack();
              // Trigger token refresh when going back
              if (onTokenGenerated) {
                onTokenGenerated();
              }
            }}
            className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Generate Walk-in Token</h2>
        <p className="text-green-100">Get your queue number for immediate consultation</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Patient
          </label>
          <input
            type="text"
            value={user.name}
            className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Department *
          </label>
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
            <p className="text-sm text-gray-600">
              For elderly (65+), emergency, or special cases
              {user.age >= 65 && <span className="text-red-600 font-semibold"> - Auto-selected (Age: {user.age})</span>}
            </p>
          </div>
        </motion.label>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl ${
              message.includes('Failed') || message.includes('error') 
                ? 'bg-red-50 text-red-700' 
                : 'bg-green-50 text-green-700'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !selectedDepartment}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Token'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-semibold hover:bg-gray-600 transition-all"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default PatientTokenGeneration;