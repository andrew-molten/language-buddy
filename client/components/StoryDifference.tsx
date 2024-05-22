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
  // create a function for this
  // also guard against index -1
  const messageContent = data.choices[0].message.content
  // const sliceFrom = messageString.indexOf('{')
  // const sliceTo = messageString.lastIndexOf('}')
  // const messageContent = messageString.slice(sliceFrom, sliceTo + 1)

  console.log(messageContent)
  console.log(typeof messageContent)
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
