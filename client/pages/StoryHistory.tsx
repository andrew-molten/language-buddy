import { StoryData } from '../../models/stories'
import StorySnippet from '../components/StorySnippet'
import { useStoryHistory } from '../hooks/useStories'

function StoryHistory() {
  const storyHistory = useStoryHistory()

  if (!storyHistory || storyHistory.isPending) {
    return <p>Loading..</p>
  }
  if (storyHistory.isError) {
    return <p>{String(storyHistory.error)}</p>
  }

  const dataCopy = [...storyHistory.data]
  const reversedData: StoryData[] = dataCopy.reverse()

  return (
    <div className=" page">
      <h1 className="page-heading">History</h1>
      {reversedData.map((data) => (
        <StorySnippet key={data.id} data={data} />
      ))}
    </div>
  )
}
export default StoryHistory
