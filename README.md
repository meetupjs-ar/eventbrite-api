# eventbrite-api

[![Build Status](https://travis-ci.org/meetupjs-ar/eventbrite-api.svg?branch=master)](https://travis-ci.org/meetupjs-ar/eventbrite-api) [![Greenkeeper badge](https://badges.greenkeeper.io/meetupjs-ar/eventbrite-api.svg)](https://greenkeeper.io/)

Microservicio que devuelve un JSON con los próximos eventos de eventbrite indicados por configuración

[eventbrite-api](https://eventbrite-api.now.sh/)

## Como funciona

-   Usa el [API de eventbrite](https://www.eventbrite.com/developer/v3/) para obtener los meetups que apliquen para la configuración dada (un rango de distancia sobre una latitud y una longitud)
-   Usa [memory-cache](https://github.com/ptarjan/node-cache) para almacenar los resultados por un tiempo determinado (indicado por configuración), para que no se estén haciendo pedidos todo el tiempo

## Desarrollo

> Antes de empezar, duplicar el archivo `.env-template`, nombrarlo como `.env` y reemplazar por los valores que se necesiten

```bash
npm install
npm run dev
```

## Licencia

MIT
