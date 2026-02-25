FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    texlive-xetex \
    fonts-lmodern \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir tmp

EXPOSE 8080

CMD ["npm", "start"]