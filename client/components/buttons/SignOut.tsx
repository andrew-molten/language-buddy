import { useAuth0 } from '@auth0/auth0-react'

interface Props {
  text: string
}

function SignOutBtn({ text }: Props) {
  const { logout } = useAuth0()

  const handleSignOut = () => {
    logout({
      logoutParams: { returnTo: 'https://languagebuddy.andrewmolten.com' },
    })
  }

  return (
    <button
      type="button"
      className="py-1 px-2 ml-2 mt-4 rounded-lg fail"
      onClick={handleSignOut}
    >
      {text}
    </button>
  )
}

export default SignOutBtn
