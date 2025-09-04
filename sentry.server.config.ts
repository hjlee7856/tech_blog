// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://eca324a42d7d522fdebf1bd71f8eab49@o4509958679035904.ingest.us.sentry.io/4509958681788416",
    tracesSampleRate: 1,
    enableLogs: true,
    debug: false,
  })
}
