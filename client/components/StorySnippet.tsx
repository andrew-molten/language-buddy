import { useState } from 'react'
import DisplayStory from './DisplayStory'
import { StoryData } from '../../models/stories'

interface Props {
  data: StoryData
}

function StorySnippet({ data }: Props) {
  const [clicked, setClicked] = useState(false)
  const storyOneSnippet = data.story_one.split(' ').slice(0, 12).join(' ')
  const storyTranslated = data.story_translated
    .split(' ')
    .slice(0, 10)
    .join(' ')

  function handleClick() {
    setClicked(!clicked)
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
          <div className="card-container history-card">
            <p className="">{data.date_added}</p>
            <p className="ml-2">{storyOneSnippet}</p>
            <p className="ml-2">{storyTranslated}</p>
          </div>
        </>
      ) : (
        <DisplayStory data={data} />
      )}
    </button>
    // </div>
  )
}

export default StorySnippet
