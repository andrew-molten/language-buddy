import { useState } from 'react'
import DisplayStory from './DisplayStory'

function StorySnippet({ data }) {
  const [clicked, setClicked] = useState(false)
  console.log(data)
  const storyOneSnippet = data.story_one.split(' ').slice(0, 12).join(' ')
  const storyTwoSnippet = data.story_two.split(' ').slice(0, 10).join(' ')

  function handleClick() {
    setClicked(!clicked)
    console.log(clicked)
    // return <DisplayStory data={data} />
  }

  return (
    // <div
    //   className="story-snippet"
    //   tabIndex="0"
    //   role="button"
    //   onClick={handleClick}
    // >
    <button className="story-snippet" onClick={handleClick}>
      {clicked === false ? (
        <>
          <p className="snippet-p">{storyOneSnippet}</p>
          <p className="snippet-p">{storyTwoSnippet}</p>
        </>
      ) : (
        <DisplayStory data={data} />
      )}
    </button>
    // </div>
  )
}

export default StorySnippet
