import type { VocabWord } from '../../models/stories'

interface Props {
  data: VocabWord
}

function VocabWord({ data }: Props) {
  return (
    <div className="data-word">
      <p className="snippet-p">
        <strong>{data.word}</strong> - {data.definition}
      </p>
    </div>
  )
}
export default VocabWord
