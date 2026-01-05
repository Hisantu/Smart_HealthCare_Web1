import { useEffect, useState } from "react"
import { API } from "../services/api"

export default function StaffDashboard({ deptId }) {
  const [tokens, setTokens] = useState([])

  async function load() {
    const r = await API.get(`/tokens?deptId=${deptId}`)
    setTokens(r.data.tokens)
  }

  useEffect(() => {
    load()
  }, [deptId])

  async function callNext() {
    const r = await API.post("/tokens/call-next", { deptId })
    alert("Called: " + r.data.token.tokenNo)
    load()
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">Staff Dashboard</h2>

      <button
        className="bg-accent text-white px-4 py-2 rounded mt-4"
        onClick={callNext}
      >
        Call Next
      </button>

      <h3 className="mt-6 text-xl">All Tokens</h3>

      <div className="mt-3">
        {tokens.map((t) => (
          <div key={t._id} className="p-3 border rounded mt-2 bg-gray-100">
            Token #{t.tokenNo} - {t.status}
          </div>
        ))}
      </div>
    </div>
  )
}
