import pino from "pino"

const logger = pino({
    level: "debug",
    redact: ["pg_password"],
})

export default logger
