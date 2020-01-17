# Solitude API

* **URL**
https://stark-fortress-32066.herokuapp.com/api/users

  * **Method:**
  `POST` 

  * **Data Params**
    `{ user_name: "username", password: "Password!0" }`

  * **Success Response:**
    * **Code:** 201 <br />
      **Content:**
      `{ "id": 9, "user_name": "username" }`

  * **Error Response:**
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Username already taken }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'user_name' in request body }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'password' in request body }`

  * **Sample Call:**
    `fetch('https://stark-fortress-32066.herokuapp.com/api/users',{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({user_name: "username", password: "Password!0"})})`

* **URL**
https://stark-fortress-32066.herokuapp.com/api/auth/login

  * **Method:**
  `POST` 

  *  **URL Params**
     **Required:**
    'user_name: [string]'
    'password: [string]'

  * **Data Params**
    `{ user_name: "username", password: "Password!0" }`

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:**
      `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc" }`

  * **Error Response:**
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Incorrect user_name or password }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'user_name' in request body }`
    * **Code:** 400 <br />
      **Content:**
      `{ :error": Missing 'password' in request body }`

  * **Sample Call:**
    `fetch('https://stark-fortress-32066.herokuapp.com/api/auth/login',{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({user_name: "username", password: "Password!0"})})`
    
* **URL**
https://stark-fortress-32066.herokuapp.com/api/auth/refresh

  * **Method:**
  `POST` 

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:**
      `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc" }`

  * **Sample Call:**
    `fetch('https://stark-fortress-32066.herokuapp.com/api/auth/refresh',{method:'POST', headers: {content-type: 'application/json','authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}}})`

* **URL**
https://stark-fortress-32066.herokuapp.com/api/date_categories

  * **Method:**
  `GET`, `POST` 

  * **Data Params**
    `{ name: "2020-01" }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 9, "name": "category name", "userid": 1}, {"id": 20, "name": "2020-01", "userid": 1 }]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 9, "name": "2020-01", "userid": 1}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 9, "name": "2020-01", "userid": 1}`

  * **Error Response:**
    * GET
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Category not found'} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`

  * **Sample Call:**
    * POST
    `fetch('https://stark-fortress-32066.herokuapp.com/api/date_categories',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({name: "2020-01"})})`
    * GET
    `fetch('https://stark-fortress-32066.herokuapp.com/api/date_categories',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://stark-fortress-32066.herokuapp.com/api/date_categories/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`

* **URL**
https://stark-fortress-32066.herokuapp.com/api/journals

  * **Method:**
  `GET`, `POST`, `DELETE`, `PATCH`

  * **Data Params**
    `{ name: "journal name", duration: 5, goal: "some goal", beforemood: "some before mood", aftermood: "some after mood", content: "some content", categoryid: 1 }`

  * **Success Response:**
    * GET
      **Code:** 200 <br />
      **Content:**
      `{ [{"id": 7,"name": "test","duration": 5,"date": "2020-01-15T20:41:44.882Z","goal": "goal","beforemood": "stressed","aftermood": "relieved","content": "content","categoryid": 1,"userid": 1},{"id": 10,"name": "test2","duration": 5,"date": "2020-01-16T04:56:25.705Z","goal": "some goal","beforemood": "some mood","aftermood": "some mood","content": "","categoryid": 1,"userid": 1}]}`
    * GET (:id)
      **Code:** 200 <br />
      **Content:**
      `{"id": 7,"name": "test","duration": 5,"date": "2020-01-15T20:41:44.882Z","goal": "goal","beforemood": "stressed","aftermood": "relieved","content": "content","categoryid": 1,"userid": 1}`
    * POST
      **Code:** 201 <br />
      **Content:**
      `{"id": 14,"name": "testing","duration": 15,"date": "2020-01-17T05:06:45.269Z","goal": "test goal","beforemood": "test before mood","aftermood": "test after mood","content": "","categoryid": 1,"userid": 1}`    
    * DELETE/PATCH
      **Code:** 204<br />
      
  * **Error Response:**
    * GET/DELETE/PATCH
      **Code:** 404 <br />
      **Content:**
      `{ error: {message: 'Journal not found'} }`
    * PATCH
      **Code:** 400 <br />
      **Content:**
      `{ error: {message: "Request body must contain either 'name', 'duration', 'goal', 'beforemood', 'aftermood', 'content', or 'categoryid'"} }`
    * POST
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'name' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'duration' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'goal' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'beforemood' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'aftermood' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'content' in request body' }`
      **Code:** 400 <br />
      **Content:**
      `{ error": {message: 'Missing 'categoryid' in request body' }`
      
  * **Sample Call:**
    * POST
    `fetch('https://stark-fortress-32066.herokuapp.com/api/journals',{method:'POST', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({"name": "testing","duration": 15,"goal": "test goal","beforemood": "test before mood","aftermood": "test after mood","content": "","categoryid": 1})})`
    * GET
    `fetch('https://stark-fortress-32066.herokuapp.com/api/journals',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * GET (:id)
    `fetch('https://stark-fortress-32066.herokuapp.com/api/journals/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * DELETE (:id)
    `fetch('https://stark-fortress-32066.herokuapp.com/api/journals/1',{method:'GET', headers: {'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}})`
    * PATCH (:id)
    `fetch('https://stark-fortress-32066.herokuapp.com/api/journals/1',{method:'GET', headers: {content-type: 'application/json', 'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE1NzUwNzMxNjIsImV4cCI6MTU3NTA5MTE2Miwic3ViIjoidXNlcm5hbWUifQ.wqsciU73_3QXWeikuioLb6nNxTvX-iQav_lKXL84PSc'}, body: JSON.stringify({"name": "testing","duration": 15,"goal": "test goal","beforemood": "test before mood","aftermood": "test after mood","content": "","categoryid": 1})})`
