# General Description

Open source code of caue24 website https://album-des-territoires.cauedordogne.com
<ici mettre description du site>
This website is mostly interactive maps loading static data (markdown and geojson) and some external tiles.

# Architecture

Static website build through Jekyll.
Published on github pages, using jekyll from github pages.

## Technologies

* static html
* leaflet
* backbone js
* turfjs

# installation

## Development


Setup a Jekyll as the one used by github, a simple jekyll should be enough.
Then run it frmo the source code with:

```
  jekyll serve --watch
```

 Then browse to: http://localhost:4000/```

## Deployments

Production site is automatically updated by github pages's jekyll when some code is pushed on branch `gh-pages`.

## architecture fonctionelle
(pour le futur dev qui viens corriger)
