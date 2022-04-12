# Miyagi

Find and list techniques to organize and explore. This is a React / Firebase v9 project

### Geolocation

The users use Google geocoding to get the coords from the address field. You need to either rename .env.example to .env and add your Google Geocode API key OR in the **CreateListing.jsx** file you can set **geolocationEnabled** to "false" and it will add a lat/lng field to the form.

### Project Resources

https://trello.com/miyagi55
https://www.figma.com/file/ZZb2InWMvD9K6CIUDR5hsk/Juji?node-id=0%3A1
https://fontawesome.com/docs/web/style/style-cheatsheet
https://react-bootstrap.github.io/

### Design Influences

https://vercel.com/dashboard
https://www.instagram.com/
https://twitter.com/home
https://codepen.io/sdthornton/pen/wBZdXq

### Run

```bash
npm start
```

### Notes

-private Route logic will protect from nullish auth objects using spinner and waiting (see profile route). Topbar uses a workaround from Firebase auth docs.
