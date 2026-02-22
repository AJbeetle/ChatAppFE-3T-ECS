# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install

# copy source
COPY . .

# build-time env from ECS / docker build
ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

# build
RUN npm run build


# ---------- Stage 2: Serve with nginx ----------
FROM nginx:alpine

# remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# expose nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]