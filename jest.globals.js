// Soon Node will have fetch API and this won't be needed
globalThis.fetch = require('node-fetch')
globalThis.scrollTo = Function.prototype
