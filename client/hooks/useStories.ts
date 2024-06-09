import { useMutation, useQuery } from '@tanstack/react-query'
import request from 'superagent'
import type { Stories } from '../../models/stories'
import { useNavigate } from 'react-router-dom'

const rootUrl = '/api/v1'

export const useChatGPT = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['compareStories'],
    mutationFn: async ({ englishStory, germanStory }: Stories) => {
      const res = await request
        .post(`${rootUrl}/check-story`)
        .send({ englishStory, germanStory })
      // console.log('useMutatation: ', res.body)
      navigate('/story-differences', { state: { response: res.body } })
      // return res.body
    },
    onSuccess: () => {},
  })
}

export const useStoryHistory = (user_id: number) => {
  return useQuery({
    queryKey: ['storyHistory'],
    queryFn: async () => {
      const res = await request.get(`${rootUrl}/story-history/${user_id}`)
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
