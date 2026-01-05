import { useState } from "react"
import { API } from "../services/api"
import PatientSelector from "./PatientSelector"

export default function TokenIssuer({ departments }) {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [deptId, setDeptId] = useState("")
  const [priority, setPriority] = useState(false)
  const [loading, setLoading] = useState(false)

  async function issue() {
    if (!selectedPatient) return alert("Select patient")
    if (!deptId) return alert("Select department")
    
    setLoading(true)
    try {
      const res = await API.post("/tokens", {
        patientId: selectedPatient,
        departmentId: deptId,
        priority
      })
      alert("Token Issued: " + res.data.tokenNumber)
      setSelectedPatient("")
      setDeptId("")
      setPriority(false)
    } catch (error) {
      alert("Error issuing token: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-6">
      <h3 className="text-xl font-bold mb-3">Issue Token</h3>

      <div className="space-y-4">
        <PatientSelector 
          selectedPatient={selectedPatient}
          onPatientSelect={setSelectedPatient}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Department *</label>
          <select
            className="w-full border p-2 rounded"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments?.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id="priority"
            checked={priority}
            onChange={() => setPriority(!priority)}
          />
          <label htmlFor="priority">Priority</label>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          onClick={issue}
          disabled={loading}
        >
          {loading ? "Issuing..." : "Issue Token"}
        </button>
      </div>
    </div>
  )
}
