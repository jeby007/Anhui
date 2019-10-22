const log4js = require('log4js');
import config from '../config'

log4js.configure({

    appenders: {
        console: {type: 'console'},
        info: {
            type: 'dateFile',
            filename: 'logs/datong-info',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['console', 'info'], level: 'info'}
	}
});

export default log4js

