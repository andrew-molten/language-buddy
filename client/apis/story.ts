import request from 'superagent'

const rootUrl = '/api/v1'

export function getFruits(): Promise<string[]> {
  return request.get(rootUrl + '/fruits').then((res) => {
    return res.body.fruits
  })
}

export function postStoryDifference() {
  return request.post(rootUrl + '/check-story').then((res) => {
    console.log('postStoryDifference: ', res.body)
    return res.body
  })
}
