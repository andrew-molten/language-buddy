// import { useFruits } from '../hooks/useFruits.ts'
// import StoryChecker from './StoryChecker.tsx'

import { Outlet } from 'react-router-dom'

function App() {
  // const { data } = useFruits()

  return (
    <>
      <div className="app">
        <header>
          <h1>Language buddy </h1>
          {/* <StoryChecker /> */}
        </header>
        {/* <ul>{data && data.map((fruit) => <li key={fruit}>{fruit}</li>)}</ul> */}
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
