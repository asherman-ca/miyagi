import { toast } from "react-toastify"

const onFollow = (e, auth) => {
  e.preventDefault()
  if (!auth.currentUser) {
    toast.error('Must be logged in')
  } else {
    toast.success('User followed')
  }
  console.log(e)
}

export { onFollow }