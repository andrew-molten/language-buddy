import { useState } from 'react'
import TwoStories from './TwoStories.tsx'
import Journal from './Journal.tsx'

function StoryChecker() {
  const [mode, setMode] = useState({ current: 'Journal', next: 'Checker' })

  const handleModeChange = function () {
    if (mode.current === 'Journal') {
      setMode({ current: 'Story Checker', next: 'Journal' })
    } else {
      setMode({ current: 'Journal', next: 'Story Checker' })
    }
  }

  return (
    <div>
      <div>
        <button
          className="switch-btn"
          onClick={handleModeChange}
        >{`< ${mode.next}`}</button>
      </div>
      {mode.current === 'Journal' ? <Journal /> : <TwoStories />}
    </div>
  )
}

export default StoryChecker
