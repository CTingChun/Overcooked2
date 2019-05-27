// Public
class ProxyHandler extends ConnectBase {
  constructor(db, key, type) {
    super();
    
    // Init Variable
    this.db = db;
    this.key = key;
    this.proxyName = `custom${key}Proxy`;
    this.type = type;
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
    // 1 Variable Definition
    let isPass = true;

    // 1-1 Check If Have PropertyMap Defined On it
    if (typeof target.propertyMap !== 'undefined') {
      // 1-1-1 Check is to pass to original object based on map
      if (target.propertyMap === 'body' && this.SpriteBodyMap.includes(property)) isPass = false;
    }
    // 2-1 Is Main Object
    else {
      // 2-1-1 Check Is to pass to original object based on type.
      if (this.type === 'sprite' && this.SpriteMap.includes(property)) isPass = false;
    }

    // 3-1 isPass or to DB
    if (isPass) {
      // 3-1-1 Update To target
      target[property] = value;
    } else {
      // 3-1-2 Update To Firebase
      this.db.doc(target.DBDocName).update({
        [property]: value
      });
    }
  }
}