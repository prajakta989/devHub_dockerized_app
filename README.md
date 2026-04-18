# devHub - Production-Ready MERN Application

![CI/CD](https://github.com/prajakta989/devHub_dockerized_app/actions/workflows/ci-cd.yml/badge.svg)

## Overview

DevHub is a full-stack MERN application deployed using a production-style DevOps workflow. The project demonstrates how to containerize, automate, deploy, and serve a modern web application using Docker, jenkins, AWS EC2, and Nginx.

## Tech Stack
### Frontend
- react
- vite
- tailwind CSS

### backend
- Node js
- Express js
- MongoDB
- JWT Authentication

### DevOps / Deployment
- Docker
- Docker Compose
- jenkns CI
- Docker Hub
- AWS EC2
- Nginx Reverse Proxy
- Cloudflare + Custom Domain

## Features
- User authentication using JWT
- Frontend and backend separated into independent services
- Dockerized frontend, backend, and MongoDB
- Reverse proxy setup using Nginx
- API routing through /api
- Custom domain support
- CI pipeline using Jenkins
- Docker image build and push to Docker Hub
- Environment variable management using .env
- Health check endpoint for backend monitoring

## Architecture
<img width="443" height="172" alt="architecture" src="https://github.com/user-attachments/assets/acf781f4-0687-45c8-97e7-3ddd6c5db517" />

### Docker setup
## build Images Locally
```docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER ./devHub-web```
```docker build -t $BACKEND_IMAGE:$BUILD_NUMBER ./DevHub```

