// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
