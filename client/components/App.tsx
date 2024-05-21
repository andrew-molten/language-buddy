// import { useFruits } from '../hooks/useFruits.ts'
import StoryChecker from './StoryChecker.tsx'

function App() {
  // const { data } = useFruits()

  return (
    <>
      <div className="app">
        <div>
          <StoryChecker />
        </div>
        {/* <ul>{data && data.map((fruit) => <li key={fruit}>{fruit}</li>)}</ul> */}
      </div>
    </>
  )
}

export default App
