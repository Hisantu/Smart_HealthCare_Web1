import { useEffect, useState } from "react"
import { API } from "../services/api"
import TokenIssuer from "../components/TokenIssuer"

export default function Tokens() {
  const [deps, setDeps] = useState([])

  useEffect(() => {
    API.get("/departments")
      .then(res => setDeps(res.data))
      .catch(err => console.error("Failed to fetch departments:", err))
  }, [])

  return (
    <div className="p-6">
      <TokenIssuer departments={deps} />
    </div>
  )
}
