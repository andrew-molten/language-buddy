interface Props {
  data: Data
}
interface Data {
  choices: Message[]
}

interface Message {
  message: { content: string; role: string }
}

interface Correction {
  original: string
  correction: string
}

interface NewWord {
  word: string
  meaning: string
}

// use array.map tp map over corrections and words to add to vocab, so that we can get the objects from it

function StoryDifference({ data }: Props) {
  const messageContent = JSON.parse(
    data.choices[0].message.content.slice(7, -3),
  )
  console.log(messageContent)
  return (
    <div>
      <h1>Differences</h1>
      <p>Proper translation: {messageContent.translatedGermanStory}</p>
      <h2>Corrections</h2>
      <ul>
        {messageContent.corrections.map((correction: Correction) => {
          return (
            <li key={correction.original}>
              {correction.original}: <strong>{correction.correction}</strong>
            </li>
          )
        })}
      </ul>
      <h2>New words</h2>
      <ul>
        {messageContent.wordsToAddToVocabulary.map((newWord: NewWord) => {
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
