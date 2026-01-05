import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

function Login({ onLogin }) {
  const [step, setStep] = useState('role'); // 'role', 'staff', 'patient', 'register'
  const [role, setRole] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [patientData, setPatientData] = useState({ phone: '', name: '', email: '', age: '', gender: 'Male' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(selectedRole === 'staff' ? 'staff' : 'patient');
    setError('');
    setCredentials({ username: '', password: '' });
    setPatientData({ phone: '', name: '', email: '', age: '', gender: 'Male' });
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', credentials);
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/patients?phone=${credentials.username}`);
      if (data.length > 0) {
        onLogin({ ...data[0], role: 'patient' }, 'patient-token');
      } else {
        setError('Patient not found. Please register first.');
      }
    } catch (err) {
      setError('Patient not found. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/patients', patientData);
      onLogin({ ...data, role: 'patient' }, 'patient-token');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white bg-opacity-95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-96 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-full mb-4 shadow-lg">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Smart Health</h1>
          <p className="text-gray-600 font-medium">Queue Management System</p>
        </div>

        {step === 'role' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Select Your Role</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('staff')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Staff Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('patient')}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Patient Login
            </motion.button>
          </div>
        )}

        {step === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setStep('role')} className="text-blue-600 hover:text-blue-800">
                ← Back
              </button>
              <h2 className="text-xl font-bold">Staff Login</h2>
            </div>
            <input
              type="text"
              placeholder="Staff ID"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-xs text-center text-gray-500">Demo: receptionist / recep123</p>
          </form>
        )}

        {step === 'patient' && (
          <form onSubmit={handlePatientLogin} className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setStep('role')} className="text-blue-600 hover:text-blue-800">
                ← Back
              </button>
              <h2 className="text-xl font-bold">Patient Login</h2>
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('register')}
              className="w-full bg-gray-500 text-white p-4 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              New Patient? Register
            </button>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handlePatientRegister} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setStep('patient')} className="text-blue-600 hover:text-blue-800">
                ← Back
              </button>
              <h2 className="text-xl font-bold">Patient Registration</h2>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={patientData.name}
              onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={patientData.phone}
              onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={patientData.email}
              onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Age"
                value={patientData.age}
                onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={patientData.gender}
                onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register & Login'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default Login;