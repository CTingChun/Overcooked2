// Public
class ProxyHandler {
  constructor(db, key) {
    // Init Variable
    this.db = db;
    this.key = key;
    this.proxyName = `custom${key}Proxy`;
  }

  // Get Handler
  get(target, property) {
    // 1 Check If Need To Carry On
    if (target.hasOwnProperty(property) && typeof target[property] === 'object') {
      // 1-1 Check If Need To Add A Proxy
      if (typeof target[property][this.proxyName] === 'undefined') {
        // 1-1-1 Add New Proxy
        target[property][this.proxyName] = Proxy.revocable(target[property], this);

        // 1-1-2 Add Map Type
        target[property].propertyMap = property;

        // Add Doc To DB
        this.db.doc(`${this.key}-${property}`).set({
          '_init': 1
        });

        // Add Event Listner
        target[property].dbEventListner = this.db.doc(`${this.key}-${property}`).onSnapshot((doc) => {
          // Extract Data
          let data = doc.data();
          if (typeof data._init !== 'undefined') delete data._init;

          // Assign to Original target
          Object.assign(target[property], data);
        });

        // Add Doc Name
        target[property].DBDocName = `${this.key}-${property}`;
      }

      // 1-2 Return Proxy
      return target[property][this.proxyName].proxy;
    } else {
      // 2-1 Return Property
      return target[property];
    }
  }

  // Set Handler
  set(target, property, value) {
    // 3-1-2 Update To Firebase
    this.db.doc(target.DBDocName).update({
      [property]: value
    });
    return true;
  }
}