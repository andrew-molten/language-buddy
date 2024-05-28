// use array.map tp map over corrections and words to add to vocab, so that we can get the objects from it
import type { Message, Correction, NewWord } from '../../models/stories'
import { useLocation } from 'react-router-dom'

interface Data {
  choices: Message[]
}

function StoryDifference() {
  const location = useLocation()
  const data: Data = location.state.response

  // create a function for this
  // also guard against index -1
  const messageContent = data.choices[0].message.content

  const parsedContent = JSON.parse(messageContent)
  // add guards against corrections, words or translation not being available
  return (
    <div>
      <h1>Differences</h1>
      <p>Proper translation: {parsedContent.translatedGermanStory}</p>
      <h2>Corrections</h2>
      <ul>
        {parsedContent.corrections.map((correction: Correction) => {
          return (
            <li key={correction.original}>
              {correction.original}: <strong>{correction.correction}</strong>
            </li>
          )
        })}
      </ul>
      <h2>New words</h2>
      <ul>
        {parsedContent.wordsToAddToVocabulary.map((newWord: NewWord) => {
          return (
            <li key={newWord.word}>
              {newWord.word}: <strong>{newWord.meaning}</strong>
            </li>
          )
        })}
      </ul>
      {/* <p>Corrections: {messageContent.corrections}</p> */}
      {/* <p>New words: {messageContent.wordsToAddToVocabulary}</p> */}
    </div>
  )
}

export default StoryDifference
