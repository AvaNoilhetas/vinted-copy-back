<h1 align="center"> 👗 VINTED BACK END API 👗 </h1>

<p align="center"><a href="https://vinted-copy-project.herokuapp.com/">See the API</a></p>

## Installation

1. Clone the repo

2. Install NPM packages

   ```sh
   yarn
   ```

3. Create a .env file with :

   ```JS
   CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
   MONGODB_URI=YOUR_MONGODB_URI
   PORT=YOUR_PORT
   STRIPE_API_SECRET=YOUR_STRIPE_API_SECRET
   ```

4. Run the project

   ```JS
   npx nodemon index.js
   ```

<br/>

## API

### OFFERS

#### Get all offers

Route : /offers

Method : `GET`

Ex : https://vinted-copy-project.herokuapp.com/offers

<br/>

#### Get offer by id

Route : /offer/:id

Method : `GET`

Ex : https://vinted-copy-project.herokuapp.com/offer/5fa1d3dd30596000177366dd

<br/>

#### Publish an offer

Route : /offer/publish

Method : `POST`

| Params      | Required |
| ----------- | -------- |
| title       | Yes      |
| description | No       |
| price       | Yes      |
| image       | No       |
| condition   | No       |
| city        | No       |
| brand       | No       |
| size        | No       |
| color       | No       |

Ex : https://vinted-copy-project.herokuapp.com/offer/publish

<br/>

#### Update an offer

Route : /offer/update/:id

Method : `PUT`

| Params      | Required |
| ----------- | -------- |
| title       | No       |
| description | No       |
| price       | No       |
| image       | No       |
| condition   | No       |
| city        | No       |
| brand       | No       |
| size        | No       |
| color       | No       |

Ex : https://vinted-copy-project.herokuapp.com/offer/publish/5fa1d3dd30596000177366dd

<br/>

#### Delete an offer

Route : /offer/delete

Method : `DELETE`

| Params | Required |
| ------ | -------- |
| Id     | Yes      |

Ex : https://vinted-copy-project.herokuapp.com/offer/delete

<br/>

---

### USER

#### Add user

Route : /user/sign_up

Method : `POST`

| Params   | Required |
| -------- | -------- |
| email    | Yes      |
| password | Yes      |
| username | Yes      |
| phone    | No       |
| avatar   | No       |

Ex : https://vinted-copy-project.herokuapp.com/user/sign_up

<br/>

#### User sign in

Route : /user/sign_in

Method : `POST`

| Params   | Required |
| -------- | -------- |
| email    | Yes      |
| password | Yes      |

Ex : https://vinted-copy-project.herokuapp.com/user/sign_in

<br/>

---

### PAYMENT

#### Delete an offer

Route : /payment

Method : `POST`

| Params      | Required |
| ----------- | -------- |
| amount      | Yes      |
| description | Yes      |
| stripeToken | Yes      |

Ex : https://vinted-copy-project.herokuapp.com/payment
