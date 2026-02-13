// import React from 'react'
import './WindowControls.css'

function WindowControls() {
  return (
    <div className="window-controls">
      <button className="control-btn minimize" onClick={() => window.electronAPI?.minimize()}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button className="control-btn maximize" onClick={() => window.electronAPI?.maximize()}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button className="control-btn close" onClick={() => window.electronAPI?.close()}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  )
}

export default WindowControls
