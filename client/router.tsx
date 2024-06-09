/* eslint-disable react/jsx-key */
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import App from './components/App'
import StoryChecker from './components/StoryChecker'
import StoryDifference from './components/StoryDifference'
import StoryHistory from './components/StoryHistory'
import Vocabulary from './components/Vocabulary'
import Dojo from './components/Dojo'

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
