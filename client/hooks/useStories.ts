import { useMutation, useQuery } from '@tanstack/react-query'
import request from 'superagent'
import type { Stories } from '../../models/stories'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const rootUrl = '/api/v1'

export const useChatGPT = () => {
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['compareStories'],
    mutationFn: async ({ englishStory, germanStory }: Stories) => {
      const token = await getAccessTokenSilently()
      const res = await request
        .post(`${rootUrl}/check-story`)
        .send({ englishStory, germanStory })
        .set('Authorization', `Bearer ${token}`)

      // console.log('useMutatation: ', res.body)
      navigate('/story-differences', { state: { response: res.body } })
      // return res.body
    },
    onSuccess: () => {},
  })
}

export const useStoryHistory = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    enabled: isAuthenticated,
    queryKey: ['storyHistory'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      const res = await request
        .get(`${rootUrl}/story-history`)
        .set('Authorization', `Bearer ${token}`)
      return res.body
    },
  })
}

export const useVocabulary = (user_id: number) => {
  return useQuery({
    queryKey: ['vocabulary'],
    queryFn: async () => {
      const res = await request.get(`${rootUrl}/vocabulary/${user_id}`)
      return res.body
    },
  })
}
