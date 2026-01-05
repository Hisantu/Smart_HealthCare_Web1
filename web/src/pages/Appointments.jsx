import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-gray-600 mt-2">View all booked appointments</p>
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

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-16 rounded-2xl shadow-lg text-center"
          >
            <div className="text-6xl mb-4">📅</div>
            <p className="text-2xl text-gray-500 font-semibold">No appointments found</p>
            <p className="text-gray-400 mt-2">Book an appointment to see it here</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-pink-500 to-orange-500 text-white p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {appointment.patient?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-gray-600">📞 {appointment.patient?.phone || 'No phone'}</p>
                      <p className="text-gray-600">🏥 {appointment.department?.name || 'Unknown Department'}</p>
                      <p className="text-gray-600">👨‍⚕️ {appointment.doctor?.name || 'Unknown Doctor'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                      📅 {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                      🕒 {appointment.timeSlot}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(appointment.status)}`}>
                      {appointment.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
                
                {appointment.reason && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Reason for Visit:</p>
                    <p className="text-gray-600">{appointment.reason}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Appointments;