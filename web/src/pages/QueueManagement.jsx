import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import io from 'socket.io-client';

// Use same origin in production, localhost in development
const getSocketURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  return import.meta.env.PROD ? window.location.origin : 'http://localhost:4000';
};

const socket = io(getSocketURL());

function QueueManagement() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [tokens, setTokens] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dailyStats, setDailyStats] = useState({ totalTokens: 0, totalAppointments: 0, patientsServed: 0 });
  const [allTokensToday, setAllTokensToday] = useState([]);
  const [counters, setCounters] = useState([
    { id: 1, name: 'Counter 1', doctor: '', isActive: false },
    { id: 2, name: 'Counter 2', doctor: '', isActive: false },
    { id: 3, name: 'Counter 3', doctor: '', isActive: false }
  ]);

  useEffect(() => {
    fetchDepartments();
    
    socket.on('tokenCreated', (token) => {
      if (!selectedDept || token.department._id === selectedDept) {
        setTokens(prev => [...prev, token]);
        // Add to today's tokens and update count
        setAllTokensToday(prev => {
          const updated = [...prev, token];
          setDailyStats(prevStats => ({ ...prevStats, totalTokens: updated.length }));
          return updated;
        });
      }
    });

    socket.on('tokenCalled', (token) => {
      setTokens(prev => prev.map(t => t._id === token._id ? token : t));
    });

    socket.on('tokenUpdated', (token) => {
      setTokens(prev => prev.map(t => t._id === token._id ? token : t));
      // Refresh stats when a token is completed
      if (token.status === 'completed') {
        fetchDailyStats();
      }
    });

    return () => {
      socket.off('tokenCreated');
      socket.off('tokenCalled');
      socket.off('tokenUpdated');
    };
  }, [selectedDept]);

  useEffect(() => {
    if (selectedDept) {
      fetchDoctors();
      fetchTokens();
      fetchAppointments();
      fetchDailyStats();
    }
  }, [selectedDept, counters]);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      console.log('Fetched departments:', data);
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get(`/doctors?department=${selectedDept}`);
      console.log('Fetched doctors for department:', selectedDept, data);
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch ALL tokens created today for this department (including completed ones)
      const tokensResponse = await api.get(`/tokens?department=${selectedDept}`);
      const todayTokens = tokensResponse.data.filter(token => {
        const tokenDate = new Date(token.createdAt).toISOString().split('T')[0];
        return tokenDate === today;
      });
      
      // Count completed tokens (patients served)
      const completedTokens = todayTokens.filter(token => token.status === 'completed');
      
      // Fetch ALL appointments for today
      const appointmentsResponse = await api.get(`/appointments?department=${selectedDept}&date=${today}`);
      
      setDailyStats({
        totalTokens: todayTokens.length, // Count all tokens created today
        totalAppointments: appointmentsResponse.data.length,
        patientsServed: completedTokens.length // Count completed consultations
      });
      setAllTokensToday(todayTokens); // Store for reference
    } catch (error) {
      console.error('Failed to fetch daily stats:', error);
      setDailyStats({ totalTokens: 0, totalAppointments: 0, patientsServed: 0 });
      setAllTokensToday([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await api.get(`/appointments?department=${selectedDept}&date=${today}`);
      
      // Get active doctors from counters
      const activeDoctors = counters
        .filter(c => c.isActive && c.doctor)
        .map(c => c.doctor);
      
      // Only show appointments if there are active counters with doctors
      if (activeDoctors.length > 0) {
        const filteredAppointments = data.filter(a => 
          ['scheduled', 'confirmed'].includes(a.status) && 
          activeDoctors.includes(a.doctor._id)
        );
        setAppointments(filteredAppointments);
      } else {
        // No active counters, show empty list
        setAppointments([]);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    }
  };

  const fetchTokens = async () => {
    try {
      const { data } = await api.get(`/tokens?department=${selectedDept}`);
      const activeTokens = data.filter(t => ['waiting', 'called'].includes(t.status));
      setTokens(activeTokens);
      // Don't count old tokens in daily stats - only count new ones from this session
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setTokens([]);
    }
  };

  const updateCounter = (counterId, field, value) => {
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { ...c, [field]: value } : c
    ));
  };

  const callToken = async (tokenId, counterId) => {
    const counter = counters.find(c => c.id === counterId);
    try {
      await api.patch(`/tokens/${tokenId}/call`, { 
        counter: counter.name,
        doctor: counter.doctor 
      });
      fetchTokens();
    } catch (error) {
      console.error('Failed to call token:', error);
    }
  };

  const skipToken = async (tokenId) => {
    try {
      await api.patch(`/tokens/${tokenId}/skip`);
      fetchTokens();
    } catch (error) {
      console.error('Failed to skip token:', error);
    }
  };

  const completeToken = async (tokenId) => {
    try {
      await api.patch(`/tokens/${tokenId}/complete`);
      fetchTokens();
    } catch (error) {
      console.error('Failed to complete token:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Queue Management</h1>
            <p className="text-gray-600 mt-2">Manage 3 counters with different doctors</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition font-semibold"
          >
            ← Back
          </motion.button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                // Reset counters when department changes
                setCounters([
                  { id: 1, name: 'Counter 1', doctor: '', isActive: false },
                  { id: 2, name: 'Counter 2', doctor: '', isActive: false },
                  { id: 3, name: 'Counter 3', doctor: '', isActive: false }
                ]);
                // Reset current session data only
                setTokens([]);
                setAppointments([]);
              }}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Daily Statistics */}
          {selectedDept && (
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dailyStats.totalTokens}</div>
                  <div className="text-sm text-blue-700 font-semibold">Total Tokens Today</div>
                  <div className="text-xs text-gray-500 mt-1">(All statuses)</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dailyStats.totalAppointments}</div>
                  <div className="text-sm text-green-700 font-semibold">Total Appointments Today</div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{dailyStats.patientsServed}</div>
                  <div className="text-sm text-orange-700 font-semibold">Patients Served</div>
                  <div className="text-xs text-gray-500 mt-1">(Completed today)</div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{tokens.filter(t => t.status === 'waiting').length}</div>
                  <div className="text-sm text-yellow-700 font-semibold">Currently Waiting</div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{tokens.filter(t => t.status === 'called').length}</div>
                  <div className="text-sm text-purple-700 font-semibold">Currently Called</div>
                </div>
              </div>
            </div>
          )}

          {selectedDept && (
            <div className="grid md:grid-cols-3 gap-4">
              {counters.map(counter => (
                <div key={counter.id} className="border-2 border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-lg mb-3 text-center">{counter.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Doctor</label>
                      <select
                        value={counter.doctor}
                        onChange={(e) => updateCounter(counter.id, 'doctor', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Doctor</option>
                        {doctors.filter(d => !counters.some(c => c.id !== counter.id && c.doctor === d._id)).map(d => (
                          <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>
                        ))}
                        {counter.doctor && (
                          <option key={counter.doctor} value={counter.doctor}>
                            {doctors.find(d => d._id === counter.doctor)?.name} - {doctors.find(d => d._id === counter.doctor)?.specialization}
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={counter.isActive}
                        onChange={(e) => updateCounter(counter.id, 'isActive', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label className="text-sm font-semibold">Active</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedDept && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Appointments List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-green-600">📅</span> Appointments ({appointments.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {appointments.map(appointment => (
                  <div key={appointment._id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-sm font-bold text-green-700 mb-1">
                      {appointment.timeSlot}
                    </div>
                    <p className="font-semibold text-sm">{appointment.patient.name}</p>
                    <p className="text-xs text-gray-600">{appointment.doctor.name}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-sm">No appointments today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Token Queue */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-600">📋</span> Token Queue ({tokens.filter(t => t.status === 'waiting').length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tokens.filter(t => t.status === 'waiting').map(token => (
                  <div key={token._id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`${token.priority ? 'bg-red-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-sm font-bold inline-block mb-1`}>
                          {token.tokenNumber}
                        </div>
                        <p className="font-semibold text-sm">{token.patient.name}</p>
                        {token.priority && <span className="text-red-600 text-xs font-bold">⭐ PRIORITY</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {tokens.filter(t => t.status === 'waiting').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-2xl mb-1">📭</div>
                    <p className="text-sm">No waiting tokens</p>
                  </div>
                )}
              </div>
            </div>

            {/* Counter Sections */}
            {counters.filter(c => c.isActive && c.doctor).map(counter => {
              const doctor = doctors.find(d => d._id === counter.doctor);
              // Each counter gets its own queue based on doctor assignment
              const doctorTokens = tokens.filter(t => !t.assignedDoctor || t.assignedDoctor === counter.doctor);
              const nextToken = doctorTokens.find(t => t.status === 'waiting');
              const myCalledToken = tokens.find(t => t.status === 'called' && t.counter === counter.name);
              
              return (
                <div key={counter.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    {counter.name}
                  </h2>
                  <div className="text-center mb-4 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <p className="font-bold text-purple-700">{doctor?.name}</p>
                    <p className="text-sm text-purple-600">{doctor?.specialization}</p>
                    <p className="text-xs text-gray-500 mt-1">Queue: {doctorTokens.filter(t => t.status === 'waiting').length} patients</p>
                  </div>
                  
                  {myCalledToken && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                      <p className="text-sm font-semibold text-yellow-800 mb-2">Currently Serving:</p>
                      <div className="bg-yellow-500 text-white px-3 py-2 rounded font-bold text-center">
                        {myCalledToken.tokenNumber}
                      </div>
                      <p className="text-sm text-center mt-2">{myCalledToken.patient.name}</p>
                      <p className="text-xs text-center text-gray-600">Consultation in progress</p>
                      <button
                        onClick={() => completeToken(myCalledToken._id)}
                        className="w-full mt-3 bg-green-500 text-white py-2 rounded hover:bg-green-600 text-sm"
                      >
                        Complete Consultation
                      </button>
                    </div>
                  )}
                  
                  {nextToken && !myCalledToken && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                      <p className="text-sm font-semibold text-blue-800 mb-2">Next Patient:</p>
                      <div className={`${nextToken.priority ? 'bg-red-500' : 'bg-blue-500'} text-white px-3 py-2 rounded font-bold text-center`}>
                        {nextToken.tokenNumber}
                      </div>
                      <p className="text-sm text-center mt-2">{nextToken.patient.name}</p>
                      <p className="text-xs text-center text-gray-600">{nextToken.patient.phone}</p>
                      {nextToken.priority && <p className="text-center text-red-600 text-xs font-bold mt-1">⭐ PRIORITY CASE</p>}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => callToken(nextToken._id, counter.id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 text-sm"
                        >
                          Call Patient
                        </button>
                        <button
                          onClick={() => skipToken(nextToken._id)}
                          className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-sm"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!nextToken && !myCalledToken && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm">No patients waiting</p>
                      <p className="text-xs text-gray-400">Ready for next patient</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default QueueManagement;