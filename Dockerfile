# Step 1: Build the React app
FROM node:14-alpine as build

WORKDIR /app

# Copy only package.json and package-lock.json first to leverage Docker's cache
COPY package.json package-lock.json ./

# Install dependencies only if package.json or package-lock.json changes
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the React application
RUN npm run build

# Step 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3030
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
