import { useState } from "react"
import api from "../api/axios"

export default function AppointmentForm({ doctors, departments }) {
  const [patientPhone, setPhone] = useState("")
  const [patientName, setName] = useState("")
  const [doctorId, setDoctor] = useState("")
  const [deptId, setDept] = useState("")
  const [slot, setSlot] = useState("")

  async function submit() {
    const p = await api.post("/patients", {
      phone: patientPhone,
      name: patientName
    })

    const patientId = p.data.patient._id

    const r = await api.post("/appointments/book", {
      patientId,
      doctorId,
      deptId,
      slotTime: slot
    })

    alert("Appointment booked!")
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4">Book Appointment</h3>

      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Patient Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <select className="w-full border p-2 rounded mb-2" onChange={(e) => setDept(e.target.value)}>
        <option>Select Department</option>
        {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>

      <select className="w-full border p-2 rounded mb-2" onChange={(e) => setDoctor(e.target.value)}>
        <option>Select Doctor</option>
        {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>

      <input
        type="date"
        className="w-full border p-2 rounded mb-2"
        onChange={(e) => setSlot(e.target.value)}
      />

      <input
        type="time"
        className="w-full border p-2 rounded"
        onChange={(e) => setSlot(prev => `${prev.split('T')[0]}T${e.target.value}`)}
      />

      <button
        className="bg-primary text-white px-4 py-2 rounded mt-4 w-full"
        onClick={submit}
      >
        Book Appointment
      </button>
    </div>
  )
}
