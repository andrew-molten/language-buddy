import { useState } from 'react'
import TwoStories from './TwoStories.tsx'
import Journal from './Journal.tsx'

function StoryChecker() {
  const [currentMode, setCurrentMode] = useState('Journal')

  const handleModeChange = function () {
    if (currentMode === 'Journal') {
      setCurrentMode('Checker')
    } else {
      setCurrentMode('Journal')
    }
  }

  return (
    <div>
      <div>
        <button onClick={handleModeChange}>{`${currentMode} mode`}</button>
      </div>
      {currentMode === 'Journal' ? <Journal /> : <TwoStories />}
    </div>
  )
}

export default StoryChecker
