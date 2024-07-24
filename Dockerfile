# Stage 1: Build the React app
FROM node:18.20.3 as build

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files
COPY . ./

# Build the app
RUN npm run build

# Stage 2: Serve app with nginx
FROM nginx:1.27.0-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx.conf to the nginx directory
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 8081

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
