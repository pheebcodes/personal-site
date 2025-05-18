FROM node:24

ENV HOST=0.0.0.0
EXPOSE 4321

WORKDIR /home/node/app
COPY astro.config.ts package-lock.json package.json postcss.config.cjs tsconfig.json /home/node/app
COPY public /home/node/app/public
COPY src /home/node/app/src

RUN npm install && npm run build
CMD ["node", "dist/server/entry.mjs"]
