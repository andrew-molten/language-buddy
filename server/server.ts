import express from 'express'
import * as Path from 'node:path'

import checkStory from './routes/checkStory.ts'
import storyHistory from './routes/storyHistory.ts'
import vocabulary from './routes/vocabulary.ts'
const server = express()

server.use(express.json())

server.use('/api/v1/check-story', checkStory)
server.use('/api/v1/story-history', storyHistory)
server.use('/api/v1/vocabulary', vocabulary)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
