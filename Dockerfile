FROM node:20-alpine
WORKDIR /app
COPY package*.* ./
# docker-compose에서 build directive아래 args directive의 값이 들어온다.
ARG NODE_ENV   
ARG PORT
# NODE_ENV의 값은 루트디렉토리의 nodeenv.txt에 저장한다. '/'이 없으면 /app디렉토리에 저장되는데 아래의 'COPY . .'에 의해 host 디렉토리의 내용으로 지워져서 nodeenv.txt파일이 삭제된다.
RUN echo $NODE_ENV > /nodeenv.txt   
RUN npm ci
COPY . .
# Set permissions. RUN이나 COPY는 모두 root permission이 필요하다. 그래서 위 까지는 root로 실행하고 아래에 chown으로 node로 permission을 바꾸고, 그 아래에서 USER를 node로 바꾼다.
RUN chown -R node:node /app
# # Set user. 위 chown에 지정된 user/group과 같아야 한다.
USER node
EXPOSE $PORT
RUN echo "Port open is ${PORT}"
CMD ["npm", "run", "dev"]