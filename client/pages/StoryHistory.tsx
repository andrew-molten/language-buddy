// import { useEffect, useState } from 'react'
import { StoryData } from '../../models/stories'
import StorySnippet from '../components/StorySnippet'
import { useStoryHistory } from '../hooks/useStories'
// import { useAuth0 } from '@auth0/auth0-react'
// import { UseQueryResult } from '@tanstack/react-query'

function StoryHistory() {
  // const { data, isPending, isError, error } = useStoryHistory(1)
  // const [storyHistory, setStoryHistory] =
  //   useState<UseQueryResult<StoryData[], Error>>()
  // const { getAccessTokenSilently } = useAuth0()

  // when loading I want to pass a token to useStoryHistory

  // useEffect(() => {
  //   const fetchToken = async () => {
  // const token = await getAccessTokenSilently()
  //     // setToken(token);
  const storyHistory = useStoryHistory()
  //     // const storyHistory = useStoryHistory(1, token)
  //     setStoryHistory(storyHistory)
  //   }
  //   fetchToken()
  // }, [])

  // const storyHistory = useStoryHistory(1)
  // const token = await getAccessTokenSilently()

  if (!storyHistory || storyHistory.isPending) {
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
      <h2 className="page-heading">History</h2>
      {reversedData.map((data) => (
        <StorySnippet key={data.id} data={data} />
      ))}
    </div>
  )
}
export default StoryHistory
