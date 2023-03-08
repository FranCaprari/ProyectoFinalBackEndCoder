import log4js from "log4js";

log4js.configure({
    appenders: {
        console: {
            type: "console" 
        },
        errorFile: {
            type: "file",
            filename: "./logs/error.log"
        },
        warnFile: {
            type: "file",
            filename: "./logs/warn.log" 
        },
        loggerConsole: {
            appender: "console",
            type: "logLevelFilter",
            level: "info"
        },
        loggerError: {
            appender: "errorFile",
            type: "logLevelFilter",
            level: "error"
        }, 
        loggerWarn: {
            appender: "warnFile",
            type: "logLevelFilter",
            level: "warn"
        }
    },
    categories: {
        default: {
            appenders: [
                "loggerConsole",
                "loggerError",
                "loggerWarn", 
            ],
            level: "all"
        }
    }
});

const logger = log4js.getLogger()


export default logger;