import express from 'express'
import * as Path from 'node:path'

import checkStory from './routes/checkStory.ts'
import storyHistory from './routes/storyHistory.ts'
import vocabulary from './routes/vocabulary.ts'
import dojo from './routes/dojo.ts'
import user from './routes/user.ts'
const server = express()

server.use(express.json())

server.use('/api/v1/check-story', checkStory)
server.use('/api/v1/story-history', storyHistory)
server.use('/api/v1/vocabulary', vocabulary)
server.use('/api/v1/dojo', dojo)
server.use('/api/v1/user', user)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
