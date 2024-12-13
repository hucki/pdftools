# Welcome to PDFTools (FAX edition `#digitalisierung`)

## Introduction

After sipgate removed the option to prefix a pdf for faxing with additional texts (to/from/subject), I quickly created this. In fact, I quickly created a tool to combine two pdfs but now we have a tool with some more features. This escalated quickly somehow...

### features

- retrieve current faxlines callerId and Alias (= sender name + number)
- lookup contacts in Addressbook (= recipient name + number)
- add cover page (optional)
- create fax document (combine with optional cover page)
- display fax document
- send fax document
- display fax journal (incoming / outgoing)
- separate telephone journal (incoming / outgoing + voicemail)

## howto

make sure to set all relvant ENV variables in `.env` (see `.env.example`)

1. search fax recipient ("Fax Empfänger") from address book or input manually
2. fill out cover page (optional)

- recipient name (will get auto filled if searched from address book)
- free text

3. upload document to fax
4. hit "PDF erzeugen" to create a new PDF (incl. optional cover page)
5. preview / download the result
6. send fax ("Fax versenden")

Reload page to update the Fax Journal ("Fax Eingang/Ausgang")

everything is running on the client.

Rest from - [Remix Docs](https://remix.run/docs)

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
- on Apple Silicon run `docker buildx build --platform linux/amd64 -t YOUR_NAME/pdftools .`
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
