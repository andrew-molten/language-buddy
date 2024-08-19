import { DBVocabWord, VocabWordWithDefinitions } from '../../models/stories'
import VocabWord from '../components/VocabWord.tsx'
import { useVocabulary } from '../hooks/useStories'

function Vocabulary() {
  const vocab = useVocabulary()

  if (vocab.isPending) {
    return <p>Loading..</p>
  }
  if (vocab.isError) {
    return <p>{String(vocab.error)}</p>
  }

  console.log(vocab.data.users)
  console.log(vocab.data.stories)
  // map over vocab.data and turn any objects with the same word_id into a bigger object which has an array of extra definitions attached
  const singleWordArray: VocabWordWithDefinitions[] = []
  vocab.data.result.forEach((wordObj: DBVocabWord) => {
    const wordIndex = singleWordArray.findIndex(
      (singleWord) => singleWord.word_id === wordObj.word_id,
    )
    if (wordIndex === -1) {
      singleWordArray.push({ ...wordObj, definitions: [] })
    } else {
      singleWordArray[wordIndex].definitions.push(wordObj.definition)
    }
  })

  return (
    <div className=" page">
      <h2 className="page-heading">Vocabulary</h2>
      {singleWordArray.map((data, index: number) => (
        <VocabWord key={data.word + index} data={data} />
      ))}
    </div>
  )
}
export default Vocabulary
