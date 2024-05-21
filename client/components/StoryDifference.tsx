interface Props {
  data: Data
}
interface Data {
  choices: Message[]
}

interface Message {
  message: { content: string; role: string }
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
      {/* <p>Corrections: {messageContent.corrections}</p> */}
      {/* <p>New words: {messageContent.wordsToAddToVocabulary}</p> */}
    </div>
  )
}

export default StoryDifference
