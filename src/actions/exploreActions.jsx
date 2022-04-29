import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'

const onSearch = async (e, setSearchWord, searchOrder, setPosts) => {
  e.preventDefault()
  setSearchWord(e.target.value)
  const postsRef = collection(db, 'posts')
  let q
  if ( searchOrder == 'liked') {
    q = query(
      postsRef,
      where('userName', '==', e.target.value),
      orderBy('likes', 'desc'),
      limit(10)
    )
  } else {
    q = query(
      postsRef,
      where('userName','==', e.target.value),
      orderBy('timestamp', 'desc'),
      limit(10)
    )
  }
  const querySnap = await getDocs(q)
  if(!querySnap.empty){
    let postArray = []
    querySnap.forEach(el => postArray.push({data: el.data(), id: el.id}))
    setPosts(postArray)
  }
}

const onOrderChange = async (type, searchWord, setPosts, setSearchOrder) => {
  setSearchOrder(type)
  const postsRef = collection(db, 'posts')
  let q
  if (type == 'timestamp') {
      q = query(
        postsRef,
        where('userName', '==', searchWord),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
      const querySnap = await getDocs(q)
      if(!querySnap.empty){
        let postArray = []
        querySnap.forEach(el => postArray.push({data: el.data(), id: el.id}))
        setPosts(postArray)
      } else {
        q = query(
          postsRef,
          orderBy('timestamp', 'desc'),
          limit(20)
        )
        const querySnap = await getDocs(q)
        const posts = []

        querySnap.forEach((doc) => {
          return posts.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setPosts(posts)
      }
  } else {
    q = query(
      postsRef,
      where('userName', '==', searchWord),
      orderBy('likes', 'desc'),
      limit(20)
    )
    const querySnap = await getDocs(q)
    if(!querySnap.empty){
      let postArray = []
      querySnap.forEach(el => postArray.push({data: el.data(), id: el.id}))
      setPosts(postArray)
    } else {
      q = query(
        postsRef,
        orderBy('likes', 'desc'),
        limit(20)
      )
      const querySnap = await getDocs(q)
      const posts = []

      querySnap.forEach((doc) => {
        return posts.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setPosts(posts)
    }
  }
}

export {onOrderChange, onSearch}