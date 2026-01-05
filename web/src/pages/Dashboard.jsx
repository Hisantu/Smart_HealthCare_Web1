import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PatientDashboard from './PatientDashboard';

function Dashboard({ user, onLogout }) {
  // If user is a patient, show PatientDashboard
  if (user?.role === 'patient') {
    return <PatientDashboard user={user} onLogout={onLogout} />;
  }
  const getCardsForRole = () => {
    const allCards = [
      { to: '/register-patient', icon: '👤', title: 'Patient Registration', desc: 'Register new patients', color: 'from-blue-500 to-blue-600', svg: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', roles: ['admin', 'receptionist', 'patient'] },
      { to: '/generate-token', icon: '🎫', title: 'Generate Token', desc: 'Create walk-in tokens', color: 'from-green-500 to-green-600', svg: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', roles: ['admin', 'receptionist'] },
      { to: '/queue', icon: '📋', title: 'Queue Management', desc: 'Manage patient queue', color: 'from-purple-500 to-purple-600', svg: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', roles: ['admin', 'receptionist'] },
      { to: '/appointments', icon: '📅', title: 'Appointments', desc: 'Book appointments', color: 'from-pink-500 to-pink-600', svg: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', roles: ['admin', 'receptionist', 'patient'] },
      { to: '/display', icon: '📺', title: 'Display Board', desc: 'View queue display', color: 'from-orange-500 to-orange-600', svg: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', roles: ['admin', 'receptionist', 'patient'] }
    ];
    
    return allCards.filter(card => card.roles.includes(user?.role));
  };

  const cards = getCardsForRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Smart Health</h1>
              <p className="text-sm text-blue-100">Queue Management System</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="text-right bg-white bg-opacity-10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-xs text-blue-100 capitalize">{user.role}</p>
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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 text-center"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Welcome Back!</h2>
          <p className="text-xl text-gray-600">Select an option to get started with patient care</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.to}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -15, transition: { duration: 0.3 } }}
            >
              <Link to={card.to} className="block h-full">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group h-full">
                  <div className={`bg-gradient-to-br ${card.color} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 opacity-10">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d={card.svg} />
                      </svg>
                    </div>
                    <div className="text-6xl mb-3 transform group-hover:scale-125 transition-transform duration-300 relative z-10">{card.icon}</div>
                    <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.svg} />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">{card.title}</h2>
                    <p className="text-gray-600 mb-4">{card.desc}</p>
                    <div className="flex items-center text-blue-600 font-bold text-lg">
                      <span>Open Module</span>
                      <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold">Real-time</p>
                <p className="text-blue-100">Queue Updates</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold">Instant</p>
                <p className="text-purple-100">Notifications</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold">Secure</p>
                <p className="text-pink-100">& Reliable</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
