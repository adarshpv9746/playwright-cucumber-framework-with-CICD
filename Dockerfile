FROM ubuntu

# Install dependencies
RUN apt-get update && apt-get install -y \
    # libatk-bridge2.0-0 \
    # libx11-xcb1 \
    # libxcb-dri3-0 \
    # libdrm2 \
    # libgbm1 \
    # libxcomposite1 \
    # libxdamage1 \
    # libgtk-3-0 \
    # libatspi2.0-0 \
    # libpangocairo-1.0-0 \
    # libxss1 \
    # libnss3 \
    # libasound2 \
    # libatk1.0-0 \
    curl \
    xvfb

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npx playwright install-deps 

# Set up virtual display with Xvfb
ENV DISPLAY=:99
RUN Xvfb :99 -screen 0 1920x1080 &

# Copy the project files
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

# Run the automation script
RUN chmod +x execute.sh
CMD xvfb-run ./execute.sh tst firefox cucumber
#CMD [ "xvfb-run", "./execute.sh", "tst", "firefox", "cucumber"]
