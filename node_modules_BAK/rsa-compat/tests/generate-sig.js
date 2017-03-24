'use strict';

var RSA = require('../').RSA;

var keypair = {
  privateKeyJwk: {
    "kty": "RSA",
    "n": "AMJubTfOtAarnJytLE8fhNsEI8wnpjRvBXGK/Kp0675J10ORzxyMLqzIZF3tcrUkKBrtdc79u4X0GocDUgukpfkY+2UPUS/GxehUYbYrJYWOLkoJWzxn7wfoo9X1JgvBMY6wHQnTKvnzZdkom2FMhGxkLaEUGDSfsNznTTZNBBg9",
    "e": "AQAB",
    "d": "HT8DCrv69G3n9uFNovE4yMEMqW7lX0m75eJkMze3Jj5xNOa/4qlrc+4IuuA2uuyfY72IVQRxqqqXOuvS8ZForZZk+kWSd6z45hrpbNAAHH2Rf7XwnwHY8VJrOQF3UtbktTWqHX36ITZb9Hmf18hWsIeEp8Ng7Ru9h7hNuVxKMjk=",
    "p": "AONjOvZVAvhCM2JnLGWJG3+5Boar3MB5P4ezfExDmuyGET/w0C+PS60jbjB8TivQsSdEcGo7GOaOlmAX6EQtAec=",
    "q": "ANrllgJsy4rTMfa3mQ50kMIcNahiEOearhAcJgQUCHuOjuEnhU9FfExA/m5FXjmEFQhRwkuhk0QaIqTGbUzxGDs=",
    "dp": "ALuxHOpYIatqeZ+wKiVllx1GTOy8z+rQKnCI5wDMjQTPZU2yKSYY0g6IQFwlPyFLke8nvuLxBQzKhbWsBjzAKeE=",
    "dq": "XLhDAmPzE6rBzy+VtXnKl247jEd9wZzTfh9uOuwBa9TG0Lhcz2cvb11YaH0ZnGNGRW/cTQzzxDUN1531TlIRYQ==",
    "qi": "AI2apz6ECfGwhsvIcU3+yFt+3CA78CUVsX4NUul5m3Cls2m+5MbGQG5K0hGpxjDC3OmXTq1Y5gnep5yUZvVPZI4="
  }
};

/*
var ursaResult = {
  "header": {
    "alg": "RS256",
    "jwk": {
      "kty": "RSA",
      "n": "AMJubTfOtAarnJytLE8fhNsEI8wnpjRvBXGK/Kp0675J10ORzxyMLqzIZF3tcrUkKBrtdc79u4X0GocDUgukpfkY+2UPUS/GxehUYbYrJYWOLkoJWzxn7wfoo9X1JgvBMY6wHQnTKvnzZdkom2FMhGxkLaEUGDSfsNznTTZNBBg9",
      "e": "AQAB"
    }
  },
  "protected": "eyJub25jZSI6IjhlZjU2MjRmNWVjOWQzZWYifQ",
  "payload": "JLzF1NBNCV3kfbJ5sFaFyX94fJuL2H-IzaoBN-ciiHk",
  "signature": "Wb2al5SDyh5gjmkV79MK9m3sfNBBPjntSKor-34BBoGwr6n8qEnBmqB1Y4zbo-5rmvsoPmJsnRlP_hRiUY86zSAQyfbisTGrGBl0IQ7ditpkfYVm0rBWJ8WnYNqYNp8K3qcD7NW72tsy-XoWEjNlz4lWJeRdEG2Nt4CJgnREH4Y"
};
var forgeResult = {
  "header": {
    "alg": "RS256",
    "jwk": {
      "kty": "RSA",
      "n": "AMJubTfOtAarnJytLE8fhNsEI8wnpjRvBXGK/Kp0675J10ORzxyMLqzIZF3tcrUkKBrtdc79u4X0GocDUgukpfkY+2UPUS/GxehUYbYrJYWOLkoJWzxn7wfoo9X1JgvBMY6wHQnTKvnzZdkom2FMhGxkLaEUGDSfsNznTTZNBBg9",
      "e": "AQAB"
    }
  },
  "protected": "eyJub25jZSI6IjhlZjU2MjRmNWVjOWQzZWYifQ",
  "payload": "JLzF1NBNCV3kfbJ5sFaFyX94fJuL2H-IzaoBN-ciiHk",
  "signature": "Wb2al5SDyh5gjmkV79MK9m3sfNBBPjntSKor-34BBoGwr6n8qEnBmqB1Y4zbo-5rmvsoPmJsnRlP_hRiUY86zSAQyfbisTGrGBl0IQ7ditpkfYVm0rBWJ8WnYNqYNp8K3qcD7NW72tsy-XoWEjNlz4lWJeRdEG2Nt4CJgnREH4Y"
};
*/

var jws = RSA.signJws(
  keypair
, new Buffer('24bcc5d4d04d095de47db279b05685c97f787c9b8bd87f88cdaa0137e7228879', 'hex')
, '8ef5624f5ec9d3ef'
);

console.log(JSON.stringify(jws, null, '  '));
