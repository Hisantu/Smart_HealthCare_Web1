import { useEffect, useState } from "react"
import { API } from "../services/api"
import DisplayBoard from "../components/DisplayBoard"

export default function Display() {
  const [deps, setDeps] = useState([])
  const [deptId, setDept] = useState("")

  useEffect(() => {
    API.get("/doctors/departments").then(r => setDeps(r.data.departments))
  }, [])

  return (
    <div className="p-6">
      <select className="border p-2 rounded mt-3" onChange={e => setDept(e.target.value)}>
        <option>Select Department</option>
        {deps.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>

      {deptId && <DisplayBoard deptId={deptId} />}
    </div>
  )
}
