# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Accept build arg from Jenkins
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code (but not .env)
COPY . .

# Build React app (injects VITE_* variables)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
