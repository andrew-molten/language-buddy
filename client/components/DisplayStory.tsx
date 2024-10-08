import { NewWord, PhraseCorrection, StoryData } from '../../models/stories'

interface Props {
  data: StoryData
}
function DisplayStory({ data }: Props) {
  console.log(data)
  return (
    <>
      <div className="card-container history-card">
        {data.short_summary && <p>{data.short_summary}</p>}
      </div>
      <div className="card-container history-card">
        <h2 className="secondary-color">Your stories</h2>
        {data.story_one && (
          <p>
            <strong>{data.language_native}:</strong> {data.story_one}
          </p>
        )}
        {data.story_two && (
          <p className="mt-2">
            <strong>{data.language_learning}:</strong> {data.story_two}
          </p>
        )}
      </div>

      {data.story_translated && (
        <div className="card-container history-card">
          <h2>AI translation</h2>
          <p>{data.story_translated}</p>
        </div>
      )}

      {data.new_words && (
        <div className="card-container history-card">
          <h2>Words learnt</h2>
          <ul>
            {JSON.parse(data.new_words).map((newWord: NewWord, i: number) => {
              return (
                <li key={`${newWord.word}+${i}`}>
                  <strong>{newWord.word}</strong>
                  {newWord.grammaticalForm &&
                    `(${newWord.grammaticalForm})`}: {newWord.definition}
                  <br />
                  Lemma: {newWord.lemma} - {newWord.lemmaDefinition}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {data.corrections && (
        <div className="card-container history-card">
          <h2>Sentences learnt</h2>
          <ul>
            {JSON.parse(data.corrections).map(
              (correction: PhraseCorrection, index: number) => {
                return (
                  <li
                    key={correction.sentenceCorrection.slice(0, 3) + index}
                    className="sentence-correction"
                  >
                    <strong>{correction.sentenceCorrection}</strong>{' '}
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
      )}
    </>
  )
}

export default DisplayStory
