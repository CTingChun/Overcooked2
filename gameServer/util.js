// Helper Function

// Get The Current Time For Logging
function logger(message='info', isError=false) {
  let now = new Date();

  if (!isError) console.log(`[Info]: ${message} [${now.toISOString()}]`);
  else console.error(`[Error]: ${message} [${now.toISOString()}]`);
}

exports.logger = logger;