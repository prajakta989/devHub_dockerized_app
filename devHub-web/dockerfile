# FROM node:20

# WORKDIR /src

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173

# CMD ["npm","run","dev"]

# Build stage
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]