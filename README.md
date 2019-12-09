This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Stack

This project is built using

- React
- Typescript
- RxJS (state management)
- React Material UI (layout composition)

## Folders explained

- `assets`: contains all application's assets

- `components/form`: contains generic components to build forms in the app using Material-UI as base
- `components/layout`: contains the components that are responsible for the application's layout, such as: Header, Breadcrumbs, Snackbar, etc.
- `components/pages`: contains the components that compose the pages of the application. Each folder inside it coincides with a Route.
- `components/shared`: contains generic components that are used across multiple parts in the application.

- `helpers`: contains mainly helper functions that are used across the application.

- `interfaces`: contains the interfaces that are used across the application.
- `interfaces/models`: contains the interfaces that compose the APIs request/response.

- `services`: contains the modules that are meant to manage the state of the application. Each folder inside this folder is the bridge between the front-end and the back-end. The files on the top level of the services folder are service-helpers/templates for building the "bridge-services".

- `settings`: contains the configurations/constants necessaries in order to make the application work properly.

## How does a service with RxJS works?

In order to cache the results, preventing the front-end to request the back-end unnecessarily and to give constant visual feedback to the user, the services have a piece of complexity. I have written a detailed explanation in the Users service (`src/services/users/user.ts`) to be used as guidance.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run build:all`

Builds the app for production for each environment.<br>
It uses the environment variables set in the _envs_ folder to configure the build properly.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).
