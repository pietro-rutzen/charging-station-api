# Charging Station API

This project is a Charging Station API built using NestJS. 

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Redis installed on your machine (for running locally without Docker Redis instance on docker also works).
- Node.js and npm (for running locally without Docker).

## Getting Started

#### Environment Variables
The application relies on the following environment variables:

As this is a test, the environment variables are hardcoded in the `docker-compose.yml` file. In a real-world scenario, these should be stored in a `.env` file.

`MONGODB_CONNECTION_STRING`: Connection string for MongoDB. 
`MONGODB_DATABASE`: MongoDB database name.
`REDIS_URL`: Redis connection URL.

### Running the Application with Docker Compose

1. **Clone the repository:**

   ```sh
    git clone <https://github.com/pietro-rutzen/charging-station-api>
    cd charging-station-api
    ```

2. **Build and start the services**
    ```
    docker-compose up --build 
    ```
3. **Access the API**

      The API will be running at `http://localhost:3000` for usage.

      You can access the Swagger documentation at `http://localhost:3000/docs` to know more about the endpoints.

5. **Running tests**

    To run the tests, please run this:

    ```
     npm run test
    ```

5. **Running load tests**

    Load tests are powered by Artillery and can be run using the following command:

    ```
     npm run load:test
    ```
    You can fine tune the duration and intensity of the load tests by modifying the `load-test.yml` file.
    Bear in mind that we are using a real world MongoDB instance for the load tests, so please be mindful of the number of requests you are making.
