# Stage 1: Build the React app
FROM node:20 AS builder

WORKDIR /app
COPY . .
ARG ENV_FILE
COPY $ENV_FILE .env

# Install deps and build the app
RUN npm install
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
