// Public
class ProxyHandler extends ConnectBase {
  constructor(proxyName, type) {
    super();
    
    // Init Variable
    this.proxyName = proxyName;
    this.type = type;
  }

  // Get Handler
  get(target, property) {
    
  }

  // Set Handler
  set(target, property, value) {

  }
}