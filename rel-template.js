(function() {
  "use strict";

  function Loader(link) {
    this.link = link;

    var onload = link.getAttribute('onload');
    this.onload = link.onload || (onload ? new Function(onload) : function() { });

    var onerror = link.getAttribute('onerror');
    this.onerror = link.onerror || (onerror ? new Function(onerror) : function() { });
  }

  Loader.prototype.load = function() {
    var self = this,
      req = new XMLHttpRequest();

    req.open('GET', this.link.href, true);
    req.setRequestHeader('Accept', this.link.type);
    req.onreadystatechange = function() {
      if(req.readyState !== 4) {
        return;
      }

      if(req.status !== 200) {
        self.onerror.call(self.link);
      } else {
        self.onload.call(self.link, req.responseText);
      }
    };

    req.send();
  };

  /* Extend the HTMLLinkElement type to allow loading. */
  HTMLLinkElement.prototype.load = function() {
    if(/template/i.test(this.rel)) {
      var loader = new Loader(this);
      loader.load();
    }
  };

  /* Load everything once the page has loaded. */
  function loadAll() {
    var links = document.getElementsByTagName('link');

    for(var i = 0; i < links.length; i++) {
      var link = links[i],
          rel = link.rel;

      if(rel && /template/i.test(rel)) {
        var loader = new Loader(link);
        loader.load();
      }
    }
  }

  if(window.addEventListener) {
    window.addEventListener('load', loadAll, false);
  } else {
    window.attachEvent('load', loadAll);
  }

})();