# RabiBook

<p align="center">
  <img alt="screenshot of rabibook" src="https://i.imgur.com/un2d0Op.png">
</p>

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Run Locally](#run-locally)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Useful Links](#useful-links)

## Features

- An user can follow other users
- User can like a post and can comment on a post
- Search user using their username

## Demo

You can create an account at **RabiBook** to explore or use the below credentials to Sign-in.

### Demo Credentials

- Email: test@example.com
- Password: test12345

### [Click here](https://rabibook.web.app/) for the Live Demo

## Technology Stack

- React-Redux
- Redux-Toolkit
- Firebase
- React Bootstrap

## Run Locally

### Prerequisites

To run this project locally one should have -

- A Firebase project created (Refer [Firebase Docs](https://firebase.google.com/docs/web/setup) for more)

### Get the repo

Download the .zip file from Github or run the below command to clone the repo locally.

```bash
git clone https://github.com/tuhindas30/rabibook.git
```

### Install dependencies

After cloning the repo, run the following command to install the project dependencies:

```bash
yarn install
```

### Set environment

Set the environment variable in `.env` file at root directory. `.env.sample` file is given an a template.

```bash
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_FIREBASE_CONFIG=firebase_config_object_stringified
```

### Run

```bash
yarn start
# Redux App will start at PORT 3000
```

## License

RabiBook is [MIT licensed](http://opensource.org/licenses/MIT).

## Disclaimer

While deploying this project to production, please keep in mind that the project is in a very basic stage and may have severe bugs and vulnaberities.

## Useful Links

- [React Redux](https://react-redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Firebase](https://firebase.google.com)
- [React Bootstrap](https://react-bootstrap.github.io/)
