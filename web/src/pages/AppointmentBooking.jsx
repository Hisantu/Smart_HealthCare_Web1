import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

function AppointmentBooking({ user, onBack, onAppointmentBooked }) {
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient: user?._id || user?.id || '',
    department: '',
    doctor: '',
    appointmentDate: '',
    timeSlot: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchDoctors(formData.department);
    }
  }, [formData.department]);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data);
    } catch (err) {
      console.error('Failed to fetch patients');
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data);
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  const fetchDoctors = async (deptId) => {
    try {
      const { data } = await api.get(`/doctors?department=${deptId}`);
      setDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appointmentData = {
        patient: formData.patient,
        department: formData.department,
        doctor: formData.doctor,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        reason: formData.reason
      };
      
      await api.post('/appointments', appointmentData);
      setMessage('Appointment booked successfully!');
      // Call the callback to refresh appointments in parent component
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
      setTimeout(() => onBack(), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-orange-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Book Appointment</h1>
          <p className="text-pink-100">Schedule a consultation with our doctors</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient *</label>
            <select
              value={formData.patient}
              onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Choose a patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name} - {p.phone}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Department *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value, doctor: '' })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Choose a department</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor *</label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
              disabled={!formData.department}
            >
              <option value="">Choose a doctor</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date *</label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot *</label>
              <input
                type="time"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
            <textarea
              placeholder="Describe your symptoms or reason for consultation"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              rows="4"
            />
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
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
              className="flex-1 bg-gradient-to-r from-pink-600 to-orange-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              Back
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default AppointmentBooking;