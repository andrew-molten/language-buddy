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
  console.log(parsedContent)
  return (
    <div className="story-difference page">
      <h1 className="page-heading">{`Here's how you did`}</h1>
      <p>{parsedContent.shortSummary}</p>
      <div className="card-container">
        <h2>Words for your Vocabulary</h2>
        <ul>
          {parsedContent.wordsToAddToVocabulary.map(
            (newWord: NewWord, i: number) => {
              return (
                <li key={`${newWord.word}+${i}`}>
                  <strong>{newWord.word}</strong>
                  {newWord.grammaticalForm &&
                    `(${newWord.grammaticalForm})`}: {newWord.definition}
                  <br />
                  {newWord.lemma === newWord.word
                    ? ''
                    : `${newWord.lemma}
                  ${' - '}
                  ${newWord.lemmaDefinition}`}
                </li>
              )
            },
          )}
        </ul>
      </div>
      <div className="card-container">
        <h2>Sentence corrections</h2>
        <ul>
          {parsedContent.corrections.map(
            (correction: PhraseCorrection, index: number) => {
              return (
                <li
                  key={correction.sentenceCorrection.slice(0, 3) + index}
                  className="sentence-correction"
                >
                  <strong>{correction.sentenceCorrection}</strong>
                  <br />
                  {correction.translation} <br />
                  {correction.explanations &&
                    correction.explanations.map((explanation) => (
                      <p key={explanation} className="ml-3">
                        ‣<em>{explanation}</em>
                      </p>
                    ))}
                </li>
              )
            },
          )}
        </ul>
      </div>

      <div className="card-container">
        <h2>The full translation:</h2>{' '}
        <p>{parsedContent.correctTranslatedStory}</p>
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
