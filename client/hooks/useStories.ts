import { useMutation } from '@tanstack/react-query'
import request from 'superagent'
import type { Stories } from '../../models/stories'
// CheckedStory,

const rootUrl = '/api/v1'

export const useChatGPT = () => {
  return useMutation({
    mutationFn: async ({ englishStory, germanStory }: Stories) => {
      const res = await request
        .post(`${rootUrl}/check-story`)
        .send({ englishStory, germanStory })
      console.log('useMutatation: ', res.body)
      return res.body
      // as CheckedStory
    },
  })
}
