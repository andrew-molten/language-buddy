function VocabWord({ data }) {
  return (
    <div className="data-word">
      <p className="snippet-p">
        <strong>{data.word}</strong> - {data.definition}
      </p>
    </div>
  )
}
export default VocabWord
