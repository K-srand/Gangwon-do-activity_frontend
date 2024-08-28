# Step 1: Build the React app
FROM node:14-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package.json ./

# Install dependencies
RUN npm install --no-cache

# Copy the rest of the application code
COPY . ./

# Build the React application
RUN npm run build

# Step 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
