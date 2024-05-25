import { useState } from 'react'
import { useChatGPT } from '../hooks/useStories.ts'
import StoryDifference from './StoryDifference'

function StoryChecker() {
  const differentiate = useChatGPT()
  const [englishStory, setEnglishStory] = useState(
    'Today I have spent the morning hanging out with my family, before getting into some coding. I had a burger for lunch, and tonight we are going to Ben & Annekes for dinner.',
  )
  const [germanStory, setGermanStory] = useState(
    'Heute morgen habe ich mit meine familie sein, und dann ich habe entwickeln gemacht. Ich hatte zum mittagessen ein burger gegessen, und heute abend gehen wir nach Ben und Annekes fur abendessen.',
  )
  // const [submittedStories, setSubmittedStories] = useState({
  //   englishStory: '',
  //   germanStory: '',
  // })

  // SWAP THIS OUT FOR USEMUTATION FUNCTION

  // CHECK REQ.BODY IN SERVER & GET STORIES OUT OF IT
  // TRY TO MAKE API CALL
  // SEND RESPONSE BACK TO CLIENT AND CHECK DATA
  // const { data, error, isLoading } = useChatGPT(submittedStories)

  // Have tabs to see the submitted english and german stories

  const handleSubmit = async function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    // add the same check to the server side?
    if (englishStory.length > 10 && germanStory.length > 10) {
      await differentiate.mutateAsync({
        englishStory: englishStory,
        germanStory: germanStory,
      })
    }
    // setSubmittedStories({
    //   englishStory: englishStory,
    //   germanStory: germanStory,
    // })
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

  if (differentiate.data) console.log(differentiate.data)

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
      {differentiate.isPending && <p>Loading...</p>}
      {differentiate.error && <p>Error: {differentiate.error.message}</p>}
      {differentiate.data && <StoryDifference data={differentiate.data} />}
    </>
  )
}

export default StoryChecker
