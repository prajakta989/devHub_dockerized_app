# devHub - Production-Ready MERN Application

![CI/CD](https://github.com/prajakta989/devHub_dockerized_app/actions/workflows/ci-cd.yml/badge.svg)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)

## Overview

DevHub is a full-stack MERN application built with a production-style DevOps workflow. It demonstrates how to containerize, automate, test, and continuously deploy a modern web application using Docker, GitHub Actions, AWS EC2, and Nginx.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [CI/CD Pipeline](#cicd-pipeline)

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework and build tool |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas | Database |
| JWT | Authentication |


### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization |
| GitHub Actions | CI/CD pipeline |
| Docker Hub | Container registry |
| AWS EC2 | Cloud hosting |
| Nginx | Reverse proxy |
| Cloudflare | DNS + Custom domain |

## 🏗 Architecture

![Architecture Diagram](https://private-user-images.githubusercontent.com/75682702/578591974-acf781f4-0687-45c8-97e7-3ddd6c5db517.png)

The application runs two Docker containers on a single EC2 instance — a frontend container serving the React app and a backend container running the Express API. Nginx sits in front of both, routing `/api` traffic to the backend and everything else to the frontend. MongoDB is hosted externally on MongoDB Atlas.

---

