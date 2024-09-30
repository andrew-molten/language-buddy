import { useState } from 'react'
import { useGetUser } from '../hooks/useUser'
import { useCheckJournalEntry } from '../hooks/useStories'

function Journal() {
  const user = useGetUser()
  const checkJournalEntry = useCheckJournalEntry()

  const [journalEntry, setJournalEntry] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target
    setJournalEntry(value)
  }

  const handleSubmit = async function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const journalToSend = {
      journalEntry,
      nativeLanguage: user.data[0].nativeLanguage,
      learningLanguage: user.data[0].learningLanguage,
    }

    await checkJournalEntry.mutateAsync(journalToSend)
  }

  return (
    <div className="page">
      <h1 className="page-heading">Journal</h1>
      <form>
        <label htmlFor="journalEntry">Journal Entry</label>
        <br />
        <textarea
          value={journalEntry}
          name="nativeStory"
          placeholder={`Write about anything you like here! Try your best to use ${user.data[0].learningLanguage}, but use ${user.data[0].nativeLanguage} whenever necessary.`}
          onChange={handleChange}
          className="story-text-box"
        />
      </form>
      <button className="check-stories-btn primary-btn" onClick={handleSubmit}>
        Submit Journal Entry
      </button>
      <p>
        This is an experimental feature, it will give you feedback on the
        journal entry, but it will not save to the database yet.
      </p>
    </div>
  )
}

export default Journal
