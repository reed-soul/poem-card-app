import React from 'react'
import './PoemCard.css'

interface Poem {
  title: string
  author: string
  dynasty: string
  content: string[]
}

interface PoemCardProps {
  poem: Poem
}

function PoemCard({ poem }: PoemCardProps) {
  return (
    <div className="poem-card">
      <div className="poem-header">
        <h1 className="poem-title">{poem.title}</h1>
        <div className="poem-meta">
          <span className="dynasty">{poem.dynasty}</span>
          <span className="author">{poem.author}</span>
        </div>
      </div>
      <div className="poem-content">
        {poem.content.map((line, index) => (
          <div key={index} className="poem-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PoemCard
