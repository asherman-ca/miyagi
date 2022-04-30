import { db } from '../firebase.config'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, limit, writeBatch, documentId } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { updateProfile } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const onNameSubmit = async (e, auth, nameForm, posts, handleEditClose) => {
  console.log('nameform', nameForm)
  e.preventDefault()
  if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
    toast.error('Demo account locked')
  } else {
  const existingUserRef = collection(db, 'users')
  const q = query(
    existingUserRef,
    where('name', '==', nameForm),
    limit(10)
  )
  
  const existingUserSnap = await getDocs(q)
  if(existingUserSnap.empty){
    await updateProfile(auth.currentUser, {
      displayName: nameForm,
    })

    const userRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userRef, {
      name: nameForm
    })

    if(posts.length > 0) {
      const batch = writeBatch(db)
      posts.forEach((post) => {
        const postRef = doc(db, 'posts', post.id)
        batch.update(postRef, {userName: nameForm})
      })
      await batch.commit()
    }
    
    toast.success('Name updated')
    handleEditClose()
  } else {
    toast.error('Name unavailable')
  }
  }
}

const onNameChange = (e, setNameForm) => {
  e.preventDefault()
  setNameForm(() => (e.target.value))
}

const onImageSubmit = async (e, auth, setLoading, urlForm, handleClose) => {
  e.preventDefault()
  if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
    toast.error('Demo account locked')
  } else {
  setLoading(true)
  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

      const storageRef = ref(storage, 'images/' + fileName)

      const uploadTask = uploadBytesResumable(storageRef, image)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
            default:
              break  
          }
        },
        (error) => {
          reject(error)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const imgUrls = await Promise.all(
    [...urlForm].map((image) => storeImage(image))
  ).catch(() => {
    setLoading(false)
    toast.error('Images not uploaded')
    return
  })

  await updateProfile(auth.currentUser, {
    photoURL: imgUrls[0],
  })

  const userRef = doc(db, 'users', auth.currentUser.uid)
  await updateDoc(userRef, {
    imageUrl: imgUrls[0]
  })

  setLoading(false)  
  handleClose()
  toast.success('Image saved')
  }
}

const onImageUpdate = (e, setUrlForm) => {
  e.preventDefault()
  setUrlForm(() => (e.target.files))
}

const onSearchChange = async (type, auth, setPosts, setSearchType) => {
  const postsRef = collection(db, 'posts')
  if(type == 'posts') {
      const q = query(
        postsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)
      let posts = []

      querySnap.forEach((doc) => {
        return posts.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setSearchType('posts')
      setPosts(posts)
  } else {
    setSearchType('likes')
    // find user likes (limit b/c 'in' query below can only pass array length <= 10)
    const likesRef = collection(db, 'likes')
    const q = query(
      likesRef,
      where('userRef', '==', auth.currentUser.uid),
      limit(10)
    )
    const querySnap = await getDocs(q)

    // create an array of postRefs from the likes
    let postRefs = []
    querySnap.forEach((doc) => {
      postRefs.push(doc.data().postRef)
    })

    if (postRefs.length) {
      // find the liked posts
      const q2 = query(
        postsRef,
        where(documentId(), 'in', postRefs),
      )
      const postsSnap = await getDocs(q2)
      let posts = []
      postsSnap.forEach((doc) => {
        return posts.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setPosts(posts)
    } else {
      setPosts([])
    }
  }
}


export { onNameChange, onNameSubmit, onImageSubmit, onImageUpdate, onSearchChange }