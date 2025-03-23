
# URL Shortener Service

A simple URL shortening service built for the GIVAI Software Engineering Internship assignment. It shortens URLs, redirects to originals, tracks hits, supports custom aliases, improved user experience and scalability

## Local Setup

## Install Docker and Docker Compose (If Not Present)
### Ubuntu/Linux

1. **Install Docker**
```bash
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg lsb-release
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
   sudo docker run hello-world
```
2. **Install Docker Compose**
```bash
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  docker-compose --version
```
3. **Post Installation**
```bash
  sudo usermod -aG docker $USER && newgrp docker
  sudo systemctl enable docker.service
```
### MacOs

Install Docker Desktop:\
Download from Docker [Desktop for Mac](https://www.docker.com/products/docker-desktop/)\

### Windows

1. **WSL2 Installation**:
````powershell
wsl --install
````
Reboot your system when prompted\

2. **Enable Virtualization**:\
-Enter BIOS/UEFI during startup (usually via F2, F10, or DEL key)\
-Enable Virtualization Technology (VT-x) or AMD-V\

3. **Install and Configure Docker Desktop**:\
-Get the installer from [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)\
-Enable WSL integration in docker

### Setup Steps
1. **Clone the Repo**
```bash
   git clone https://github.com/Adwait1609/url-shortner.git
   cd url-shortner
```
2. **Add .env File in the root folder**:
```bash
   #.env
   MONGODB_USER=user
   MONGODB_PASSWORD=pass
   MONGODB_DATABASE=urls
   MONGODB_HOST=mongo
   MONGODB_LOCAL_PORT=27017
   MONGODB_DOCKER_PORT=27017
   REDIS_HOST=redis
   REDIS_LOCAL_PORT=6379
   REDIS_DOCKER_PORT=6379
   NODE_SERVER_HOST=0.0.0.0
   NODE_SERVER_LOCAL_PORT=3000
   NGINX_LOCAL_PORT=80
   NGINX_DOCKER_PORT=80
```
3. **Start Services**
Ensure `docker-compose.yml` is in the root folder (with MongoDB and Redis configs).
```bash
   docker-compose up -d --build
   # check container using 
   # docker ps
   # docker-compose down (used to remove/stop contaniers/instances)
```

## Testing APIs

1. **Shorten a URL**
   ```bash
   curl -X POST http://localhost/api/shorten \
        -H "Content-Type: application/json" \
        -d '{"originalUrl": "https://summerofcode.withgoogle.com/"}'
   ```
   **Response**:
   ```json
   {"shortCode": "syRcDw"}
   ```

2. **Custom Alias**
   ```bash
   curl -X POST http://localhost/api/shorten \
        -H "Content-Type: application/json" \
        -d '{"originalUrl": "https://google.com", "alias": "mygoogle"}'
   ```
   **Response**:
   ```json
   {"shortCode": "mygoogle"}
   ```

3. **Redirect**
   ```bash
   curl -v http://localhost/syRcDw
   ```
   **Response**: `302`, `Location: https://summerofcode.withgoogle.com/`
4. **Hits**
   ```bash
   curl http://localhost/api/hits/syRcDw
   ```
   **Response**:
   ```json
   {"shortCode":"syRcDw","hits":2}
   ```
## System Design and Architecture
-Scalbility and load handling was handles using Nginx which balances load across three api servers(port:300) , which connets to MongoDB and Redis using Docker Compose\
-Short Code and hits are stored in MongoDB and Redis handles caching\
-Nginx uses round-robin routing to distribute requests evenly among the servers\
   
