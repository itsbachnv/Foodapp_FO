# FoodApp FO

Frontend Expo app for the FoodApp project.

## Run with Docker

This setup builds the app as a web project and serves it through Nginx.

1. Make sure the backend API is running at `http://localhost:8080`.
2. If needed, copy `mobile/.env.example` to `mobile/.env` and adjust the API URL.
3. Start the frontend:

```bash
docker compose up --build
```

4. Open the app at:

```text
http://localhost:3000
```

## API configuration

The app reads `EXPO_PUBLIC_API_BASE_URL` from the environment.
Default value:

```text
http://localhost:8080/api/v1
```

## Useful commands

```bash
docker compose build web
docker compose down
```
