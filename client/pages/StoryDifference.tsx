// use array.map tp map over corrections and words to add to vocab, so that we can get the objects from it
import type {
  Message,
  PhraseCorrection,
  NewWord,
  // Word,
} from '../../models/stories'
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

  const preprocessResponse = (response: string): string => {
    // Remove any triple backticks or jsons and newlines associated with code blocks
    return response.replace(/^```json\s*|\s*```$/g, '')
  }

  const preprocessedResponse = preprocessResponse(messageContent)

  const parsedContent = JSON.parse(preprocessedResponse)
  // add guards against corrections, words or translation not being available
  return (
    <div className="story-difference page">
      <h1 className="page-heading">{`Here's how you did`}</h1>
      <div className="card-container">
        <h2 className="secondary-color">Translation:</h2>{' '}
        <p>{parsedContent.correctTranslatedStory}</p>
      </div>
      <div className="card-container">
        <h2 className="secondary-color">Corrections</h2>
        <ul>
          {parsedContent.corrections.map(
            (correction: PhraseCorrection, index: number) => {
              return (
                <li key={correction.sentenceCorrection.slice(0, 3) + index}>
                  <strong>{correction.sentenceCorrection}</strong>
                  <br />
                  {correction.translation}
                </li>
              )
            },
          )}
        </ul>
      </div>
      <div className="card-container">
        <h2 className="secondary-color">Words for your Vocabulary</h2>
        <ul>
          {parsedContent.wordsToAddToVocabulary.map(
            (newWord: NewWord, i: number) => {
              return (
                <li key={`${newWord.word}+${i}`}>
                  <strong>{newWord.word}</strong>({newWord.grammaticalForm}):{' '}
                  {newWord.definition}
                  <br />
                  Lemma: {newWord.lemma}
                  {' - '}
                  {newWord.lemmaDefinition}
                </li>
              )
            },
          )}
        </ul>
      </div>
      {/* <h2>Well used words</h2>
      <ul>
        {parsedContent.wellUsedWords.map((word: Word, i: number) => {
          return <li key={`${word.word}+${i}`}>{word.word}</li>
        })}
      </ul> */}
      {/* <p>Corrections: {messageContent.corrections}</p> */}
      {/* <p>New words: {messageContent.wordsToAddToVocabulary}</p> */}
    </div>
  )
}

export default StoryDifference
