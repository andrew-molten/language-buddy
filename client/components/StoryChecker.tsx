import { useState } from 'react'
import { useChatGPT } from '../hooks/useStories.ts'
import StoryDifference from './StoryDifference'

function StoryChecker() {
  const [englishStory, setEnglishStory] = useState('Say this is a test!')
  const [germanStory, setGermanStory] = useState('Say this is a test!')
  const [submittedStories, setSubmittedStories] = useState({
    englishStory: '',
    germanStory: '',
  })
  const { data, error, isLoading } = useChatGPT(submittedStories)

  // Have tabs to see the submitted english and german stories

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setSubmittedStories({
      englishStory: englishStory,
      germanStory: germanStory,
    })
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target
    if (name === 'english-story') {
      setEnglishStory(value)
    }
    if (name === 'german-story') {
      setGermanStory(value)
    }
  }

  if (data) console.log(data)

  return (
    <>
      <h1>Story Checker</h1>
      <form>
        <label htmlFor="english-story">English story</label>
        <br />
        <textarea
          value={englishStory}
          name="english-story"
          // maxLength={}
          onChange={handleChange}
          style={{ width: '400px', height: '200px' }}
        />
        <br />
        <label htmlFor="german-story">German story</label>
        <br />
        <textarea
          value={germanStory}
          name="german-story"
          // maxLength={}
          onChange={handleChange}
          style={{ width: '400px', height: '200px' }}
        />
        <br />

        <button onClick={handleSubmit}>Check Stories</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <StoryDifference data={data} />}
    </>
  )
}

export default StoryChecker
