import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function PatientSelector({ selectedPatient, onPatientSelect, showAddNew = true }) {
  const [patients, setPatients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/patients', newPatient);
      setPatients([...patients, data]);
      onPatientSelect(data._id);
      setShowAddForm(false);
      setNewPatient({ name: '', phone: '', email: '', age: '', gender: 'Male' });
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient *</label>
      <div className="space-y-3">
        <select
          value={selectedPatient}
          onChange={(e) => onPatientSelect(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Choose a patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name} - {p.phone}</option>
          ))}
        </select>
        
        {showAddNew && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add New Patient
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPatient} className="mt-4 p-4 border rounded-xl bg-gray-50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={newPatient.name}
              onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Age"
              value={newPatient.age}
              onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
              className="p-3 border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Patient
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}