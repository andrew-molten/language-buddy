// use array.map tp map over corrections and words to add to vocab, so that we can get the objects from it
import type {
  Message,
  PhraseCorrection,
  NewWord,
  Word,
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
      <h1 className="page-heading">Differences</h1>
      <p>
        <strong>AI translation:</strong> {parsedContent.translatedGermanStory}
      </p>
      <h2>Corrections</h2>
      <ul>
        {parsedContent.corrections.map(
          (correction: PhraseCorrection, index: number) => {
            return (
              <li key={correction.germanSentenceCorrection.slice(0, 3) + index}>
                <strong>{correction.germanSentenceCorrection}</strong>
                <br />
                {correction.translation}
              </li>
            )
          },
        )}
      </ul>
      <h2>New words</h2>
      <ul>
        {parsedContent.wordsToAddToVocabulary.map((newWord: NewWord) => {
          return (
            <li key={newWord.word}>
              <strong>{newWord.word}</strong>({newWord.grammaticalForm}):{' '}
              {newWord.definition}
              <br />
              Lemma: {newWord.lemma}
              {' - '}
              {newWord.lemmaDefinition}
            </li>
          )
        })}
      </ul>
      <h2>Well used words</h2>
      <ul>
        {parsedContent.wellUsedWords.map((word: Word) => {
          return <li key={word.word}>{word.word}</li>
        })}
      </ul>
      {/* <p>Corrections: {messageContent.corrections}</p> */}
      {/* <p>New words: {messageContent.wordsToAddToVocabulary}</p> */}
    </div>
  )
}

export default StoryDifference
