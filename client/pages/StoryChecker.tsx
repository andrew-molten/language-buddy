import { useState } from 'react'
import { useChatGPT } from '../hooks/useStories.ts'
import { useGetUser } from '../hooks/useUser.ts'
// import StoryDifference from './StoryDifference'

function StoryChecker() {
  const differentiate = useChatGPT()
  const user = useGetUser()

  const [stories, setStories] = useState({
    nativeStory: '',
    learningLanguageStory: '',
  })

  // Have tabs to see the submitted english and german stories

  // SAVE SUBMITTEDSTORIES LOCALLY JUST IN CASE THE SERVER FAILS - SO THAT THE STORIES ARE NOT LOST

  // ADD SUBMITTED STORIES TO DATABASE - WITH CHECKED STORY DATA - useChatGPT fn?

  // delete locally stored stories once response has come through

  // THEN PERHAPS STORY DIFFERENCE SHOULD use query to get that storydata? Or useChatGPT should create it's own full reply on the backend

  // go through the translation and highlight the parts that came back in the corrections

  if (user.isPending) {
    return (
      <div className="page">
        <h1 className="page-heading">Story Checker</h1>
        <p>Loading...</p>
      </div>
    )
  }

  const handleSubmit = async function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    // add the same check to the server side?
    if (
      stories.nativeStory.length > 5 &&
      stories.learningLanguageStory.length > 5
    ) {
      const storiesToSend = {
        ...stories,
        nativeLanguage: user.data[0].nativeLanguage,
        learningLanguage: user.data[0].learningLanguage,
      }
      await differentiate.mutateAsync(storiesToSend)
    }
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
        <label htmlFor="nativeStory">{user.data[0].nativeLanguage} story</label>
        <br />
        <textarea
          value={stories.nativeStory}
          name="nativeStory"
          placeholder="Write about anything you like here! What happened today, what do you wish you could say in German..."
          // maxLength={}
          onChange={handleChange}
          // style={{ width: '400px', height: '200px' }}
          className="story-text-box"
        />
        <br />
        <label htmlFor="learningLanguageStory">
          {user.data[0].learningLanguage} story
        </label>
        <br />
        <textarea
          value={stories.learningLanguageStory}
          name="learningLanguageStory"
          placeholder="Try to write same story in German, & I'll help you improve!"
          // maxLength={}
          onChange={handleChange}
          // style={{ width: '400px', height: '200px' }}
          className="story-text-box"
        />
        <br />

        <button
          className="check-stories-btn primary-btn"
          onClick={handleSubmit}
        >
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
