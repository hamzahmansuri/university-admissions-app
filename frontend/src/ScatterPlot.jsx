import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './ScatterPlot.css'

// 24px transparent hit area behind an 8px visible dot, per dataviz interaction rules.
function Dot({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        className="viz-dot"
        stroke="var(--surface-1)"
        strokeWidth={2}
      />
    </g>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const school = payload[0].payload
  return (
    <div className="viz-tooltip">
      <p className="viz-tooltip-name">{school.name}</p>
      <p>
        <span className="viz-tooltip-value">#{school.rank}</span>
        <span className="viz-tooltip-label"> rank</span>
      </p>
      <p>
        <span className="viz-tooltip-value">{school.acceptance_rate}%</span>
        <span className="viz-tooltip-label"> acceptance rate</span>
      </p>
    </div>
  )
}

function ScatterPlot({ schools }) {
  const data = schools.filter((s) => s.rank != null && s.acceptance_rate != null)

  return (
    <div className="viz-root">
      <h2>Rank vs. acceptance rate</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--gridline)" />
          <XAxis
            dataKey="rank"
            type="number"
            name="Rank"
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
            stroke="var(--baseline)"
            label={{ value: 'Rank', position: 'insideBottom', offset: -4, fill: 'var(--text-secondary)' }}
          />
          <YAxis
            dataKey="acceptance_rate"
            type="number"
            name="Acceptance rate"
            unit="%"
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
            stroke="var(--baseline)"
            label={{
              value: 'Acceptance rate (%)',
              angle: -90,
              position: 'insideLeft',
              fill: 'var(--text-secondary)',
            }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--muted)' }} />
          <Scatter data={data} shape={Dot} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ScatterPlot
