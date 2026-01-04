sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("ui5cardcap.controller.App", {
      onInit() {
        var oCard = new sap.ui.integration.widgets.Card({
    manifest: "cards/customerCard.json"
});
        var oCard1 = new sap.ui.integration.widgets.Card({
    manifest: "cards/customerCard1.json"
});
this.byId("cardBox").addItem(oCard);
this.byId("cardBox1").addItem(oCard1);

      }
  });
});