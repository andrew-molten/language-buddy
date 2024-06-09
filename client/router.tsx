/* eslint-disable react/jsx-key */
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import App from './components/App'
import StoryChecker from './pages/StoryChecker'
import StoryDifference from './pages/StoryDifference'
import StoryHistory from './pages/StoryHistory'
import Vocabulary from './pages/Vocabulary'
import Dojo from './pages/Dojo'

// give StoryDifference data

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<StoryChecker />} />
      <Route path="story-differences" element={<StoryDifference />} />
      <Route path="story-history" element={<StoryHistory />} />
      <Route path="vocabulary" element={<Vocabulary />} />
      <Route path="dojo" element={<Dojo />} />
    </Route>,
  ),
)

export default router
