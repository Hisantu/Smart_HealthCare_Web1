import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import PatientTokenGeneration from './PatientTokenGeneration';
import PatientRegistration from './PatientRegistration';
import AppointmentBooking from './AppointmentBooking';
import DisplayBoard from './DisplayBoard';

function PatientDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'token', 'register', 'appointment', 'display'
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (activeView === 'dashboard') {
      fetchAppointments();
      fetchTokens();
    }
  }, [activeView]);

  // Update current time every minute for real-time waiting time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get(`/appointments`);
      console.log('All appointments:', data);
      console.log('Current user:', user);
      // Filter appointments for current patient (handle both object and string patient field)
      const userAppointments = data.filter(apt => {
        const patientId = typeof apt.patient === 'object' ? apt.patient._id : apt.patient;
        const userId = user._id || user.id;
        console.log('Comparing:', patientId, 'with', userId);
        return patientId === userId;
      });
      console.log('User appointments:', userAppointments);
      setAppointments(userAppointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchTokens = async () => {
    try {
      console.log('Fetching tokens...');
      const { data } = await api.get(`/tokens`);
      console.log('All tokens received:', data);
      console.log('Current user object:', user);
      
      // Filter tokens for current patient (handle both object and string patient field)
      const userTokens = data.filter(t => {
        // Skip tokens with null or undefined patient
        if (!t.patient) {
          console.log('Skipping token with null patient:', t);
          return false;
        }
        
        const patientId = typeof t.patient === 'object' ? t.patient._id : t.patient;
        const userId = user._id || user.id;
        console.log('Comparing token patient ID:', patientId, 'with user ID:', userId, 'Match:', patientId === userId);
        return patientId === userId;
      });
      
      console.log('Filtered user tokens:', userTokens);
      setTokens(userTokens);
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
    }
  };

  const handleTokenGenerated = () => {
    console.log('Token generated callback triggered');
    fetchTokens();
  };

  const handleAppointmentBooked = () => {
    fetchAppointments();
  };

  const removeToken = async (tokenId) => {
    try {
      await api.delete(`/tokens/${tokenId}`);
      fetchTokens(); // Refresh the tokens list
    } catch (error) {
      console.error('Failed to remove token:', error);
      alert('Failed to remove token. Please try again.');
    }
  };

  const removeAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error('Failed to remove appointment:', error);
      alert('Failed to remove appointment. Please try again.');
    }
  };

  const calculateWaitingTime = (token) => {
    const startTime = new Date(token.createdAt);
    const endTime = token.completedAt ? new Date(token.completedAt) : currentTime;
    const diffInMinutes = Math.floor((endTime - startTime) / (1000 * 60));
    return diffInMinutes;
  };

  const formatWaitingTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'token':
        return (
          <PatientTokenGeneration 
            user={user} 
            onBack={() => setActiveView('dashboard')}
            onTokenGenerated={handleTokenGenerated}
          />
        );
      case 'register':
        return (
          <PatientRegistration 
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'appointment':
        return (
          <AppointmentBooking 
            user={user}
            onBack={() => setActiveView('dashboard')}
            onAppointmentBooked={handleAppointmentBooked}
          />
        );
      case 'display':
        return (
          <DisplayBoard 
            onBack={() => setActiveView('dashboard')}
          />
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-10 text-center"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Welcome, {user.name}!</h2>
        <p className="text-xl text-gray-600 mb-6">Manage your appointments and view queue status</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('token')}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Generate Token
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('appointment')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('display')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Display Board
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('register')}
            className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register Patient
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            My Appointments
          </h3>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No appointments scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt._id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{apt.doctor?.name}</p>
                      <p className="text-gray-600">{apt.department?.name}</p>
                      <p className="text-sm text-gray-500">{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.timeSlot}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this appointment?')) {
                            removeAppointment(apt._id);
                          }
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                        title="Cancel Appointment"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            My Tokens
            <button
              onClick={fetchTokens}
              className="ml-auto bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              🔄 Refresh
            </button>
          </h3>
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p>No tokens generated</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map(token => {
                const waitingTime = calculateWaitingTime(token);
                return (
                  <div key={token._id} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-bold text-2xl text-green-600">{token.tokenNumber}</p>
                        <p className="text-gray-600">{token.department?.name}</p>
                        <p className="text-sm text-gray-500">{new Date(token.createdAt).toLocaleDateString()}</p>
                        <div className="mt-2">
                          <span className="text-sm font-semibold text-blue-600">
                            ⏱️ {token.status === 'completed' ? 'Total time: ' : 'Waiting: '}
                            {formatWaitingTime(waitingTime)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          token.status === 'called' ? 'bg-yellow-100 text-yellow-800' :
                          token.status === 'waiting' ? 'bg-blue-100 text-blue-800' :
                          token.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {token.status}
                        </span>
                        {(token.status === 'waiting' || token.status === 'called') && (
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this token?')) {
                                removeToken(token._id);
                              }
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                            title="Cancel Token"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Need Help?</h3>
          <p className="text-blue-100 mb-6">Contact our reception desk for assistance with appointments or queue status</p>
          <div className="flex justify-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <p className="font-semibold">📞 Reception</p>
              <p className="text-blue-100">+1 234 567 8900</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <p className="font-semibold">🕒 Hours</p>
              <p className="text-blue-100">8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <nav className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white p-6 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Patient Portal</h1>
              <p className="text-sm text-green-100">Smart Health System</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            {activeView !== 'dashboard' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('dashboard')}
                className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-opacity-30 transition font-semibold"
              >
                ← Dashboard
              </motion.button>
            )}
            <div className="text-right bg-white bg-opacity-10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-xs text-green-100">{user.phone}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="bg-red-500 bg-opacity-90 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-red-600 transition font-semibold shadow-lg"
            >
              Logout
            </motion.button>
          </motion.div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {renderContent()}
      </div>
    </div>
  );
}

export default PatientDashboard;