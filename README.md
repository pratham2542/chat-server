# chat-server

### Run Server
```
Run command in terminal :
npm install
create .env with your credentials as mentioned
npm start
```


### Add .env file

```js
PORT="Add server port"
MONGO_URL="Add mongodb uri with pasword"
JWT_SECRET="Add jwt secret key"
```

### API Routes

```
/users:
    - / :It will return all users  
    - /:userId/status : It will return status of receiver (available or busy)
/messages
    - /:id :It will return the reciepient
    - /send/:id : It will sent message from sender to reciever
/auth
    - /signup : It lets you signup using email, username(must be unique) and password
    - /login  : It will let you login using user id and password 
    - /logout : It will end the session

```
