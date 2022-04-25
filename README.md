# Miyagi

Find and list techniques to organize and explore. This is a React / Firebase v9 project

### Project Resources

stack: react + firebase auth + firebase storage
https://trello.com/miyagi55
https://react-bootstrap.github.io/
https://www.figma.com/file/ZZb2InWMvD9K6CIUDR5hsk/Juji?node-id=0%3A1

### Design Influences

https://vercel.com/dashboard
https://www.instagram.com/
https://twitter.com/home
https://youtube.com

### Run

```bash
npm start
```

### Notes

-private Route logic will protect from nullish auth objects using spinner and waiting (see profile route). Topbar uses a workaround from Firebase auth docs.

demo accounts:
genki@gmail.com
neo123

ismail@gmail.com
ismail

### Schema

User

{
name: String,
email: String,
timestamp: Time
}

Post

{
userRef: Id,
title: String,
notes: String,
instaUrls: [],
youTubeUrls: [],
images: [],
likes: Number,
timestamp: Time
}

Like

{
userRef: Id,
postRef: Id,
postUserRef: Id
}

Follow

{
followerRef: Id,
userRef: Id
}
