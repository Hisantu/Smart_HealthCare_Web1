import React, { useState, useEffect } from 'react';
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

function DisplayBoard({ onBack }) {
  const [departments, setDepartments] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
    
    socket.on('tokenCreated', fetchData);
    socket.on('tokenCalled', fetchData);
    socket.on('tokenUpdated', fetchData);
    
    const interval = setInterval(fetchData, 5000);
    
    return () => {
      socket.off('tokenCreated');
      socket.off('tokenCalled');
      socket.off('tokenUpdated');
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, tokenRes, doctorRes] = await Promise.all([
        api.get('/departments'),
        api.get('/tokens'),
        api.get('/doctors')
      ]);
      
      setDepartments(deptRes.data);
      setTokens(tokenRes.data.filter(t => ['waiting', 'called'].includes(t.status)));
      setDoctors(doctorRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getTokensForDepartment = (deptId) => {
    return tokens.filter(t => t.department && t.department._id === deptId);
  };

  const getDoctorsForDepartment = (deptId) => {
    return doctors.filter(d => d.department === deptId);
  };

  const getCalledTokenForCounter = (counterName, deptId) => {
    return tokens.find(t => t.status === 'called' && t.counter === counterName && t.department && t.department._id === deptId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold mb-2">🏥 Smart Health Queue Display</h1>
        <p className="text-lg text-blue-200">Real-time Department Status</p>
      </motion.div>

      {/* 4 Department Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {departments.map((dept, deptIndex) => {
          const deptTokens = getTokensForDepartment(dept._id);
          const deptDoctors = getDoctorsForDepartment(dept._id);
          const waitingTokens = deptTokens.filter(t => t.status === 'waiting');
          
          return (
            <motion.div
              key={dept._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: deptIndex * 0.1 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20"
            >
              {/* Department Header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-300">{dept.name}</h2>
                <p className="text-sm text-blue-200">Waiting: {waitingTokens.length} patients</p>
              </div>

              {/* 3 Counters for this department */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map(counterNum => {
                  const counterName = `Counter ${counterNum}`;
                  const calledToken = getCalledTokenForCounter(counterName, dept._id);
                  const doctor = deptDoctors[counterNum - 1];
                  
                  return (
                    <div
                      key={counterNum}
                      className={`p-3 rounded-lg text-center ${
                        calledToken 
                          ? 'bg-yellow-500 bg-opacity-90 text-black' 
                          : 'bg-gray-700 bg-opacity-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{counterName}</p>
                      {doctor && (
                        <p className="text-xs truncate">{doctor.name}</p>
                      )}
                      {calledToken ? (
                        <div className="mt-1">
                          <p className="text-lg font-bold">{calledToken.tokenNumber}</p>
                          <p className="text-xs">SERVING</p>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <p className="text-sm">---</p>
                          <p className="text-xs">READY</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Department patient list */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-center text-blue-200">Department Queue ({waitingTokens.length}):</p>
                <div className="max-h-20 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-1">
                    {waitingTokens.slice(0, 6).map(token => (
                      <div
                        key={token._id}
                        className={`px-2 py-2 rounded text-sm font-bold text-center ${
                          token.priority 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        <div>{token.tokenNumber}</div>
                      </div>
                    ))}
                  </div>
                  {waitingTokens.length === 0 && (
                    <p className="text-xs text-gray-400 text-center">No patients waiting</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Patient List Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20"
      >
        <h3 className="text-2xl font-bold text-center mb-4 text-yellow-300">📋 All Waiting Patients</h3>
        
        {tokens.filter(t => t.status === 'waiting').length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl">No patients waiting</p>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-3">
            {tokens
              .filter(t => t.status === 'waiting')
              .sort((a, b) => {
                if (a.priority && !b.priority) return -1;
                if (!a.priority && b.priority) return 1;
                return new Date(a.createdAt) - new Date(b.createdAt);
              })
              .slice(0, 18)
              .map((token, index) => (
                <motion.div
                  key={token._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg text-center ${
                    token.priority 
                      ? 'bg-red-500 bg-opacity-90 text-white' 
                      : 'bg-blue-500 bg-opacity-90 text-white'
                  }`}
                >
                  <p className="text-lg font-bold">{token.tokenNumber}</p>
                  <p className="text-xs truncate">{token.department?.name}</p>
                  {token.priority && (
                    <p className="text-xs font-bold">⭐ PRIORITY</p>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4 text-blue-200"
      >
        <p className="text-sm">🔄 Updates every 5 seconds • Please wait for your token to be called</p>
      </motion.div>
    </div>
  );
}

export default DisplayBoard;