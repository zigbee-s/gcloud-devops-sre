# Get a base Node image
FROM node

# Make the 'app' folder the current working directory
WORKDIR /app

# Copy both 'package.json' and 'package-lock.json' (if present)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

EXPOSE 3000

# Runs the website on http://localhost:8080
CMD ["node", "index.js"]