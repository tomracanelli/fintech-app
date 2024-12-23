# Payment App Backend
>Nodejs backend for payment app.

## Table of contents
* [Description](#description)
* [Live Demo](#live-demo)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [App Info](#app-info)


## Description
FinTech backend written in NodeJS, MongoDB and Express to accept payment from react native application (or from any other source).
This backend utilizes the following third party payment gateway API's :
- Lipa Na M-pesa Online.
- Co-operative Bank of Kenya IFTAccountToAccount  API. The funds transfer API allows you to make a single transfer funds request from your Co-operative Bank account to any other Co-operative Bank account.
- Braintree.

It enables two main different flows or implementations:
1. Accept payments from users.
2. Admins manage and control various services.
 
The frontend is available [here](https://github.com/jamesmogambi/payment-front-end/).
 
## Live Demo
Here is a working live demo : [payment-backend](https://chep-james.herokuapp.com/)


Use the below login so you can access admin areas:
- Email: admin@gmail.com
- Password: 123456

Use the below card to pay with Paypal or Credit Card:
- 4111 1111 1111 1111 - 01/25 - 111

Use the following test account number for Co-operative Bank Kenya:
- 36001873000

Other test accounts can be found at Co-operative Bank Developers portal available  [here](https://developer.co-opbank.co.ke:9443/store/apis/documentation)

## Technologies
* Technologies used:
  * `Node` 12.1 - provides the backend environment for this application
  * `Moongoose` 5.5 - Mongoose schemas to model the application data
  * `Express` 4.16 - middleware is used to handle requests, routes


## Setup
To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

###  Clone repo
Run the following scripts in the terminal to clone the repo
```
$ git clone git@github.com/Snazzynuhu/fintech-backend
$ cd payment-backend
```

----------------------------------

### Steps to run server
 #### 1. Setup MongoDB
 - Download and Install it from [mongodb.com](https://www.mongodb.com/try/download/community)
 
 #### 2. Get Lipa Na M-Pesa Online Credentials
 - Get Lipa Na M-Pesa test credentials from [Safaricom](https://developer.safaricom.co.ke/home)
 
 #### 3. Get Co-operative Bank of Kenya IFTAccountToAccount Credentials
 - Get Co-operative Bank of Kenya IFTAccountToAccount  credentials from [Co-operative Bank ](https://developer.co-opbank.co.ke:9443/store/apis/documentation#header9)
 
 #### 4. Get Braintree Credentials Credentials
 - Get braintree test credentials from [Braintree](https://www.braintreepayments.com/sandbox)
 
   
 #### 5. Create .env file
- Create .env file in project folder
- Enter these lines to that:

```
DATABASE=mongodb://localhost/payments
PORT=8000
JWT_SECRET=somethingsecret
MPESA_CONSUMER_KEY=mpesaconsumerkey
MPESA_CONSUMER_SECRET=mpesaconsumersecret
MPESA_SHORT_CODE=mpesashortcode 
MPESA_PASSKEY=mpesapasskey
COOP_CONSUMER_KEY=coopconsumerkey
COOP_CONSUMER_SECRET=coopconsumersecret
COOP_TEST_TOKEN=cooptesttoken
BRAINTREE_MERCHANT_ID=braintreemerchantid
BRAINTREE_PUBLIC_KEY=braintreepublickey
BRAINTREE_PRIVATE_kEY=braintreeprivatekey

```
 
 #### 5. Run Server

```bash
# Install dependencies
$ npm install

# Run the app
$ npm start
```

## Features
*  Lipa Na M-Pesa online API endpoint available at `/api/mpesa/`
*  Co-operative Bank of Kenya IFTAccountToAccount API endpoint available at `/api/coopBank/`
*  Co-operative Bank of Kenya AccountValidation API endpoint available at `/coop/payment/validateAccount/`
*  Co-operative Bank of Kenya AccountBalance API endpoint available at `/coop/payment/checkBalance/`
*  Braintree API endpoint available at `/api/braintree/`
*  User transactions API endpoint available at `/api/transactions/`
*  Payment Services  API endpoint available at `/api/services/`
*  Payment Charges  API endpoint available at `/api/charges/`
*  Custom user authentication using JSON Web Tokens. The API is available at `/api/auth/`
*  Simple users functionality: superuser can view the list of all users in admin panel. The relevant API endpoint is available at `/api/users/`.

## App Info

### Author

[James Mogambi](https://github.com/jamesmogambi)

### Version

1.0.0

### License

This project is licensed under the MIT License
