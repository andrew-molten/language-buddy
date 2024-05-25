import { useMutation } from '@tanstack/react-query'
import request from 'superagent'
import type { Stories } from '../../models/stories'
// CheckedStory,
// import request from 'superagent'
// import { API_KEY } from '../env'
// import superagent from 'superagent'

const rootUrl = '/api/v1'

// export const useChatGPT2 = ({ englishStory, germanStory }: Stories) => {
//   // console.log(API_KEY)
//   return useQuery({
//     queryKey: ['chatgpt', englishStory, germanStory],
//     queryFn: () => fetchChatGPTResponse(englishStory, germanStory),
//     enabled: !!englishStory && !!germanStory,
//   })
// }

export const useChatGPT = () => {
  return useMutation({
    // queryKey: ['translateStory', englishStory, germanStory],
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
