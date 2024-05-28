/* eslint-disable react/jsx-key */
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import App from './components/App'
import StoryChecker from './components/StoryChecker'
import StoryDifference from './components/StoryDifference'

// give StoryDifference data

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<StoryChecker />} />
      <Route path="story-differences" element={<StoryDifference />} />
    </Route>,
  ),
)

export default router
