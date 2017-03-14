# eventbrite-api

Microservicio que devuelve un JSON con los próximos eventos de eventbrite indicados por configuración

[eventbrite-api](https://eventbrite-api.now.sh/)

## Como funciona

* Usa el [API de eventbrite](https://www.eventbrite.com/developer/v3/) para obtener los meetups que apliquen para la configuración dada (un rango de distancia sobre una latitud y una longitud)
* Usa [memory-cache](https://github.com/ptarjan/node-cache) para almacenar los resultados por un tiempo determinado (indicado por configuración), para que no se estén haciendo pedidos todo el tiempo

## Desarrollo

> Antes de empezar, duplicar el archivo `.env-template`, nombrarlo como `.env` y reemplazar por los valores que se necesiten

```bash
# npm install
yarn install
npm run start-dev
```

## Colaboración

[ToDo list](https://github.com/meetupjs-ar/eventbrite-api/projects/1)

## Licencia

MIT