class MilitaryLogger {
  constructor() {
    this.levels = ['INFO', 'WARN', 'ERROR', 'CRITICAL'];
  }

  format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logId = `LOG_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    const logEntry = {
      id: logId,
      timestamp,
      level,
      message,
      ...meta
    };

    const consoleMessage = `[${level}] ${timestamp}: ${message}`;
    
    // Color coding for different levels
    switch(level) {
      case 'INFO':
        console.log(`🟢 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
        break;
      case 'WARN':
        console.warn(`🟡 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
        break;
      case 'ERROR':
        console.error(`🔴 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
        break;
      case 'CRITICAL':
        console.error(`💥 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
        break;
    }

    return logEntry;
  }

  info(message, meta = {}) {
    return this.format('INFO', message, meta);
  }

  warn(message, meta = {}) {
    return this.format('WARN', message, meta);
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? {
      errorMessage: error.message,
      errorStack: error.stack,
      errorCode: error.code
    } : {};
    
    return this.format('ERROR', message, { ...errorMeta, ...meta });
  }

  critical(message, error = null, meta = {}) {
    const criticalMeta = error ? {
      errorMessage: error.message,
      errorStack: error.stack,
      emergency: 'CRITICAL_FAILURE'
    } : {};
    
    const log = this.format('CRITICAL', message, { ...criticalMeta, ...meta });
    
    // In production, this would trigger alerts
    if (process.env.NODE_ENV === 'production') {
      this.triggerAlert(log);
    }
    
    return log;
  }

  triggerAlert(logEntry) {
    // Integration with monitoring services would go here
    console.error('🚨 ALERT TRIGGERED:', logEntry);
  }
}

module.exports = new MilitaryLogger();