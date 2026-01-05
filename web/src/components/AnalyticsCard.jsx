import { motion } from "framer-motion"

export default function AnalyticsCard({ title, value, icon, bgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl shadow-lg flex items-center gap-4 ${bgColor || "bg-white"}`}
    >
      {icon && <div className="text-4xl">{icon}</div>}

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>
    </motion.div>
  )
}
