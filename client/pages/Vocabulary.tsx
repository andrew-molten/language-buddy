import VocabWord from '../components/VocabWord'
import { useVocabulary } from '../hooks/useStories'

function Vocabulary() {
  const vocab = useVocabulary(1)

  if (vocab.isPending) {
    return <p>Loading..</p>
  }
  if (vocab.isError) {
    return <p>{String(vocab.error)}</p>
  }

  console.log(vocab.data)

  return (
    <div className=" page">
      <h2 className="page-heading">Vocabulary</h2>
      {vocab.data.map((data) => (
        <VocabWord key={data.word} data={data} />
      ))}
    </div>
  )
}
export default Vocabulary
