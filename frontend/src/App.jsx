import { useEffect, useMemo, useState } from 'react'
import ScatterPlot from './ScatterPlot'
import './App.css'

const API_BASE = 'http://127.0.0.1:8000'

function App() {
  const [schools, setSchools] = useState([])
  const [error, setError] = useState(null)

  const [state, setState] = useState('')
  const [minRank, setMinRank] = useState(1)
  const [maxRank, setMaxRank] = useState(1)

  useEffect(() => {
    fetch(`${API_BASE}/schools`)
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setSchools(data)
        const ranks = data.map((s) => s.rank).filter((r) => r != null)
        if (ranks.length) setMaxRank(Math.max(...ranks))
      })
      .catch((err) => setError(err.message))
  }, [])

  const states = useMemo(
    () => [...new Set(schools.map((s) => s.state).filter(Boolean))].sort(),
    [schools],
  )
  const rankBound = useMemo(() => {
    const ranks = schools.map((s) => s.rank).filter((r) => r != null)
    return ranks.length ? Math.max(...ranks) : 1
  }, [schools])

  const filtered = useMemo(
    () =>
      schools.filter((s) => {
        if (state && s.state !== state) return false
        if (s.rank != null && (s.rank < minRank || s.rank > maxRank)) return false
        return true
      }),
    [schools, state, minRank, maxRank],
  )

  const resetFilters = () => {
    setState('')
    setMinRank(1)
    setMaxRank(rankBound)
  }

  if (error) return <p>Error loading schools: {error}</p>

  return (
    <main>
      <h1>University Admissions Explorer</h1>

      <div className="filters">
        <label>
          State
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          Min rank: {minRank}
          <input
            type="range"
            min={1}
            max={rankBound}
            value={minRank}
            onChange={(e) => setMinRank(Math.min(Number(e.target.value), maxRank))}
          />
        </label>

        <label>
          Max rank: {maxRank}
          <input
            type="range"
            min={1}
            max={rankBound}
            value={maxRank}
            onChange={(e) => setMaxRank(Math.max(Number(e.target.value), minRank))}
          />
        </label>

        <button type="button" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <p>{filtered.length} of {schools.length} schools</p>

      <ScatterPlot schools={filtered} />

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>State</th>
            <th>Acceptance Rate</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id}>
              <td>{s.rank ?? '—'}</td>
              <td>{s.name}</td>
              <td>{s.state}</td>
              <td>{s.acceptance_rate != null ? `${s.acceptance_rate}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default App
