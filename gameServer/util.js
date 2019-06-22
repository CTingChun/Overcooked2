// Helper Function

// Get The Current Time For Logging
function logger(message='info', isError=false) {
  let now = new Date();

  if (!isError) console.log(`[Info]: ${message} [${now.toISOString()}]`);
  else console.error(`\x1b[31m[Error]: ${message} [${now.toISOString()}]\x1b[0m`);
}

exports.logger = logger;