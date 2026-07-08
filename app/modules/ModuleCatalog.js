'use client';
import { useState } from 'react';

export default function ModuleCatalog({ modules, categories }) {
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all'
    ? modules
    : modules.filter((m) => m.category === filter);

  return (
    <>
      <div className="page-header">
        <h1>Module Catalog</h1>
        <p>{modules.length} modules — every module has a keybind slot</p>
      </div>

      <div className="module-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="module-grid">
        {visible.map((m, i) => (
          <div
            className="module-item"
            key={m.id}
            style={{ animation: `fadeIn 0.4s ease ${(i % 20) * 0.03}s both` }}
          >
            <div className="module-info">
              <div className="module-name">{m.name}</div>
              {m.assigned_name && (
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                  {m.assigned_name}
                </div>
              )}
            </div>
            <div className="module-meta">
              <span className="keybind-badge">{m.keybind !== 'None' ? m.keybind : '—'}</span>
              <span className={`status status-${m.status_class}`}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
