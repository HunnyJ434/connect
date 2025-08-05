# Use Node.js LTS as the base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Set environment variables
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Start the app with your custom server.js
CMD ["node", "server.js"]
