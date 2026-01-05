import { motion } from "framer-motion"

export default function HomeHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 bg-white rounded-xl shadow-lg text-center mt-10 max-w-3xl mx-auto"
    >
      <h2 className="text-4xl font-bold text-primary">Smart Healthcare Queue</h2>
      <p className="mt-4 text-gray-600">
        Real-time token system, appointment booking, doctor availability, and queue dashboard.
      </p>
    </motion.div>
  )
}
