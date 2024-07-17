interface Props {
  fieldName: string
  labelName: string
  formState: RegistrationForm
  type: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface RegistrationForm {
  username: string
  givenName: string
  familyName: string
  birthdate: string
}

function FormField({
  fieldName,
  type,
  labelName,
  formState,
  handleChange,
}: Props) {
  return (
    <>
      <span className="mt-4 inline-block">
        <label htmlFor={fieldName}>{labelName}: </label>
        <input
          name={fieldName}
          id={fieldName}
          type={type}
          className="text-black"
          value={formState[fieldName as keyof RegistrationForm]}
          onChange={handleChange}
        />
      </span>
      <br />
    </>
  )
}

export default FormField
