import { useState } from 'react'
import { useChatGPT } from '../hooks/useStories.ts'
// import StoryDifference from './StoryDifference'

function StoryChecker() {
  const differentiate = useChatGPT()
  const [stories, setStories] = useState({
    englishStory:
      'Today I have spent the morning hanging out with my family, before getting into some coding. I had a burger for lunch, and tonight we are going to Ben & Annekes for dinner.',
    germanStory:
      'Heute morgen habe ich mit meine familie sein, und dann ich habe entwickeln gemacht. Ich hatte zum mittagessen ein burger gegessen, und heute abend gehen wir nach Ben und Annekes fur abendessen.',
  })

  const [submittedStories, setSubmittedStories] = useState({
    englishStory: '',
    germanStory: '',
  })

  // Have tabs to see the submitted english and german stories

  // SAVE SUBMITTEDSTORIES LOCALLY JUST IN CASE THE SERVER FAILS - SO THAT THE STORIES ARE NOT LOST

  // ADD SUBMITTED STORIES TO DATABASE - WITH CHECKED STORY DATA - useChatGPT fn?

  // delete locally stored stories once response has come through

  // THEN PERHAPS STORY DIFFERENCE SHOULD use query to get that storydata? Or useChatGPT should create it's own full reply on the backend

  // go through the translation and highlight the parts that came back in the corrections

  const handleSubmit = async function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    // add the same check to the server side?
    if (stories.englishStory.length > 10 && stories.germanStory.length > 10) {
      setSubmittedStories({
        englishStory: stories.englishStory,
        germanStory: stories.germanStory,
      })
      await differentiate.mutateAsync(stories)
    }
    setStories({ englishStory: '', germanStory: '' })
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target
    setStories({ ...stories, [name]: value })
  }

  // if (differentiate.data) console.log(differentiate.data)

  return (
    <>
      <h1>Story Checker</h1>
      <form>
        <label htmlFor="englishStory">English story</label>
        <br />
        <textarea
          value={stories.englishStory}
          name="englishStory"
          // maxLength={}
          onChange={handleChange}
          style={{ width: '400px', height: '200px' }}
        />
        <br />
        <label htmlFor="germanStory">German story</label>
        <br />
        <textarea
          value={stories.germanStory}
          name="germanStory"
          // maxLength={}
          onChange={handleChange}
          style={{ width: '400px', height: '200px' }}
        />
        <br />

        <button onClick={handleSubmit}>Check Stories</button>
      </form>
      {differentiate.isPending && <p>Loading...</p>}
      {differentiate.error && <p>Error: {differentiate.error.message}</p>}
      {/* {differentiate.data && <StoryDifference data={differentiate.data} />} */}
    </>
  )
}

export default StoryChecker
