import { useEffect, useState } from "react"
import { API, socket } from "../services/api"

export default function DisplayBoard({ deptId }) {
  const [current, setCurrent] = useState(null)
  const [queue, setQueue] = useState([])

  useEffect(() => {
    loadData()

    socket.on("token_called", (t) => setCurrent(t))
    socket.on("token_issued", () => loadData())

    return () => {
      socket.off("token_called")
      socket.off("token_issued")
    }
  }, [deptId])

  async function loadData() {
    const now = await API.get(`/display/now-serving/${deptId}`)
    const q = await API.get(`/display/queue/${deptId}`)
    setCurrent(now.data.now)
    setQueue(q.data.queue)
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-center mb-6">Now Serving</h2>
      <div className="text-center text-7xl font-extrabold text-accent">
        {current ? current.tokenNo : "--"}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Upcoming Queue</h3>

      <div className="grid grid-cols-5 gap-3">
        {queue.map((t) => (
          <div key={t._id} className="bg-gray-200 p-3 rounded text-center font-bold">
            {t.tokenNo}
          </div>
        ))}
      </div>
    </div>
  )
}
