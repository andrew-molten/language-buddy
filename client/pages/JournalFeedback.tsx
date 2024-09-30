import { useLocation } from 'react-router-dom'
import { Message, NewWord } from '../../models/stories'
import { useGetUser } from '../hooks/useUser'
import {
  LearningLanguageSentence,
  NativeLanguageSentence,
} from '../../models/journal'

interface Data {
  choices: Message[]
}

function JournalFeedback() {
  const location = useLocation()
  const user = useGetUser()

  const data: Data = location.state.response

  const messageContent = data.choices[0].message.content
  console.log(messageContent)
  const parsedContent = JSON.parse(messageContent)
  console.log(parsedContent)
  return (
    <div className="story-difference page">
      <h1 className="page-heading">{`Here's how you did`}</h1>
      {parsedContent.shortSummary && <p>{parsedContent.shortSummary}</p>}

      {parsedContent.wordsToAddToVocabulary && (
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
      )}

      {parsedContent.learningLanguageSentences && (
        <div className="card-container">
          <h2>{user.data[0].learningLanguage} Sentences</h2>
          <ul>
            {parsedContent.learningLanguageSentences.map(
              (sentence: LearningLanguageSentence, index: number) => {
                return (
                  <li
                    key={sentence.learningLanguageSentence.slice(0, 3) + index}
                    className="sentence-correction"
                  >
                    <strong>{sentence.learningLanguageSentence}</strong>
                    <br />
                    {sentence.nativeLanguageSentence} <br />
                    {sentence.explanations &&
                      sentence.explanations.map((explanation) => (
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
      )}

      {parsedContent.nativeLanguageSentences && (
        <div className="card-container">
          <h2>{user.data[0].nativeLanguage} Sentences</h2>
          <ul>
            {parsedContent.nativeLanguageSentences.map(
              (sentence: NativeLanguageSentence, index: number) => {
                return (
                  <li
                    key={sentence.nativeLanguageSentence.slice(0, 3) + index}
                    className="sentence-correction"
                  >
                    <strong>{sentence.nativeLanguageSentence}</strong>
                    <br />
                    {sentence.translatedSentence} <br />
                    {sentence.explanations &&
                      sentence.explanations.map((explanation) => (
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
      )}

      {parsedContent.correctJournalEntryLearning && (
        <div className="card-container">
          <h2>The full {user.data[0].learningLanguage} entry:</h2>
          <p>{parsedContent.correctJournalEntryLearning}</p>
        </div>
      )}
      {parsedContent.correctJournalEntryNative && (
        <div className="card-container">
          <h2>The full {user.data[0].nativeLanguage} entry:</h2>
          <p>{parsedContent.correctJournalEntryNative}</p>
        </div>
      )}
    </div>
  )
}

export default JournalFeedback
