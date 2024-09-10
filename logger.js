const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({level, message, timestamp})=>{
    return `${timestamp}[${level.toLocaleUpperCase()}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/audit.log', level: 'info' }),
        new transports.Console()
    ]
});

module.exports = logger;