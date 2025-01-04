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

# Set the default port (this is now used by Next.js)
ENV PORT 8080

# Expose the port the app will run on
EXPOSE 8080

# Start the application on the specified port
CMD ["npm", "start"]
