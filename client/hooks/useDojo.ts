import { useQuery } from '@tanstack/react-query'
import request from 'superagent'

const rootUrl = '/api/v1'

export const useDojoPhrases = (
  user_id: number,
  languageLearning: string,
  languageNative: string,
) => {
  return useQuery({
    queryKey: ['dojoPhrases'],
    queryFn: async () => {
      const res = await request.get(
        `${rootUrl}/dojo/${user_id}/${languageLearning}/${languageNative}`,
      )
      return res.body
    },
  })
}
