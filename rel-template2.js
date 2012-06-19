(function() {
  "use strict";

  Object.defineProperty(HTMLLinkElement.prototype, 'template', {
    get: function() {
      if(!/template/i.test(this.rel)) {
        return "";
      }

      var req = new XMLHttpRequest();
      req.open('GET', this.href, false);
      req.setRequestHeader('Accept', this.type || "*/*");
      req.send();

      if(req.status !== 200) {
        throw "Unable to retrieve the template.";
      } else {
        return req.responseText;
      }
    }
  });

})();