import { toast } from "react-toastify"
import { doc, deleteDoc, collection, addDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.config'

const onFollow = async (e, auth, userFollow, setUserFollow, profileUser, setUser, follows) => {
  e.preventDefault()
  if (!auth.currentUser) {
    toast.error('Must be logged in')
  } else {

    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
      if(userFollow.length < 1){
        // create follow doc and update state
        const newFollow = await addDoc(collection(db, 'follows'), {
          userRef: auth.currentUser.uid,
          followedUserRef: profileUser
        })
        setUserFollow([{
          data: {
            userRef: auth.currentUser.uid,
            followedUserRef: profileUser
          },
          id: newFollow.id
        }])

        // incriment follow count on user and update state
        await updateDoc(doc(db, 'users', profileUser), {
          follows: follows + 1
        })
        setUser((prevState) => ({
          ...prevState,
          follows: follows + 1
        }))
        toast.success('User followed')
      } else {
        // delete follow doc and update state
        await deleteDoc(doc(db, 'follows', userFollow[0].id))
        setUserFollow([])

        // decriment follow count on user and update state
        await updateDoc(doc(db, 'users', profileUser), {
          follows: follows - 1
        })
        setUser((prevState) => ({
          ...prevState,
          follows: follows - 1
        }))
        toast.warn('User unfollowed')
      }
    }
  }
}

export { onFollow }