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
import Settings from './pages/Settings'
import JournalFeedback from './pages/JournalFeedback'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<StoryChecker />} />
      <Route path="story-differences" element={<StoryDifference />} />
      <Route path="journal-feedback" element={<JournalFeedback />} />
      <Route path="story-history" element={<StoryHistory />} />
      <Route path="vocabulary" element={<Vocabulary />} />
      <Route path="dojo" element={<Dojo />} />
      <Route path="settings" element={<Settings />} />
    </Route>,
  ),
)

export default router
