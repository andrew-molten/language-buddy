import { useState } from 'react'
import { useChatGPT } from '../hooks/useStories.ts'
// import StoryDifference from './StoryDifference'

function StoryChecker() {
  const differentiate = useChatGPT()
  const [stories, setStories] = useState({
    englishStory: '',
    germanStory: '',
  })

  // const [submittedStories, setSubmittedStories] = useState({
  //   englishStory: '',
  //   germanStory: '',
  // })

  // Have tabs to see the submitted english and german stories

  // SAVE SUBMITTEDSTORIES LOCALLY JUST IN CASE THE SERVER FAILS - SO THAT THE STORIES ARE NOT LOST

  // ADD SUBMITTED STORIES TO DATABASE - WITH CHECKED STORY DATA - useChatGPT fn?

  // delete locally stored stories once response has come through

  // THEN PERHAPS STORY DIFFERENCE SHOULD use query to get that storydata? Or useChatGPT should create it's own full reply on the backend

  // go through the translation and highlight the parts that came back in the corrections

  const handleSubmit = async function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    // add the same check to the server side?
    if (stories.englishStory.length > 5 && stories.germanStory.length > 5) {
      // setSubmittedStories({
      //   englishStory: stories.englishStory,
      //   germanStory: stories.germanStory,
      // })
      await differentiate.mutateAsync(stories)
    }
    // setStories({ englishStory: '', germanStory: '' })
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target
    setStories({ ...stories, [name]: value })
  }

  // if (differentiate.data) console.log(differentiate.data)

  return (
    <div className="page">
      <h1 className="page-heading">Story Checker</h1>
      <form>
        <label htmlFor="englishStory">English story</label>
        <br />
        <textarea
          value={stories.englishStory}
          name="englishStory"
          // maxLength={}
          onChange={handleChange}
          style={{ width: '400px', height: '200px' }}
          className="story-text-box"
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
          className="story-text-box"
        />
        <br />

        <button className="check-stories-btn" onClick={handleSubmit}>
          Check Stories
        </button>
      </form>
      {differentiate.isPending && <p>Loading...</p>}
      {differentiate.error && <p>Error: {differentiate.error.message}</p>}
      {/* {differentiate.data && <StoryDifference data={differentiate.data} />} */}
    </div>
  )
}

export default StoryChecker
