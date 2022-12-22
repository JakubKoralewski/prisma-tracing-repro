// Require dependencies
const dotenv = require('dotenv');
dotenv.config();
const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { PrismaInstrumentation } = require('@prisma/instrumentation')
const { Resource } = require('@opentelemetry/resources')

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const TRACE_EXPORTER_URL = `${process.env.JAEGER_URL}/v1/traces`

const sdk = new opentelemetry.NodeSDK({
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: TRACE_EXPORTER_URL,
    // optional - collection of custom headers to be sent with each request, empty by default
  })),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'prisma-tracing-repro',
  }),
  instrumentations: [new PrismaInstrumentation(), getNodeAutoInstrumentations()],
});

sdk.start()
