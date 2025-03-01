// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://1f3a7989593230de0b96d41d05b1f5b0@o528779.ingest.us.sentry.io/4508902216892416",
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// Manually call startProfiler and stopProfiler to profile the code in between
Sentry.profiler.startProfiler();
