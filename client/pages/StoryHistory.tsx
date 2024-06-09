import { StoryData } from '../../models/stories'
import StorySnippet from '../components/StorySnippet'
import { useStoryHistory } from '../hooks/useStories'

function StoryHistory() {
  // const { data, isPending, isError, error } = useStoryHistory(1)
  const storyHistory = useStoryHistory(1)

  if (storyHistory.isPending) {
    return <p>Loading..</p>
  }
  if (storyHistory.isError) {
    return <p>{String(storyHistory.error)}</p>
  }

  console.log(storyHistory.data)
  const dataCopy = [...storyHistory.data]
  const reversedData: StoryData[] = dataCopy.reverse()

  return (
    <div className=" page">
      <h2>History</h2>
      {reversedData.map((data) => (
        <StorySnippet key={data.id} data={data} />
      ))}
    </div>
  )
}
export default StoryHistory
