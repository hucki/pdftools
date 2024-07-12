# Welcome to PDFTools (FAX edition `#digitalisierung`)

Simple tool to add a heading page to an existing pdf. After sipgate removed the option to prefix a pdf for faxing with additional texts (to/from/subject), I quickly created this.

1. Input to/from/subject
2. upload document to fax
3. hit "PDF erzeugen" to create a new PDF with the inputs added as an additional frontpage
4. preview / download the result
5. reload page to create a new pdf

everything is running on the client.

from - [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### Docker

#### create docker image

- run `docker build -t YOUR_NAME/pdftools .`
  - `-t` -> tag image with `YOUR_NAME/pdftools` (maintainer/package-name)

#### export the image to registry

either use [docker push](https://docs.docker.com/reference/cli/docker/image/push/)

or alternatively manually export the docker image to import it in your on registry

- run `docker save -o ./pdftools-image.tar YOUR_NAME/pdftools`
  - `-o` -> outputfile
- transfer exported file to docker registry

#### start image

- map internal TCP port `3000`
- start image

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
