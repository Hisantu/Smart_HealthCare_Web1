import { Link } from "react-router-dom"

export default function Header() {
  return (
    <div className="bg-primary text-white p-4 shadow-md flex justify-between">
      <h1 className="text-xl font-bold">Smart Health</h1>

      <nav className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/tokens">Tokens</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/display">Display</Link>
      </nav>
    </div>
  )
}
