sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("crud.controller.View1", {
        onInit() {

        },
        selected: function () {
            var table = this.getView().byId("table");
            var selected = table.getSelectedItem();
            if (selected) {
                this.byId("edit").setEnabled(true);
            }
            else {
                this.byId("edit").setEnabled(false);
            }
        },
        create: function () {
            this.getView().byId("dialog").open();
        },
        async save() {
            try {
                // var id = this.byId("id").getValue();
                var name = this.byId("name").getValue();
                var country = this.byId("country").getValue();
                if (!country) {
                    this.byId("country").setValueState("Error");
                    this.byId("country").setPlaceholder("Enter the field");
                    return;
                }
                var data = {
                    // ID: id,
                    name: name,
                    country: country
                }
                var table = this.getView().byId("table");
                var binding = table.getBinding("items");
                await binding.create(data);
                this.getView().byId("dialog").close();
                binding.refresh();

                this._cleardialoginput();
            } catch (error) {
                sap.m.MessageBox.error("Create failed: " + error.message);
            }
        },

        _cleardialoginput: function () {
            this.byId("id").setValue("");
            this.byId("name").setValue("");
            this.byId("country").setValue("");
        },
        cancel: function () {
            this.byId("dialog").close();
            this._cleardialoginput();
        },
        edit: function () {
            var table = this.getView().byId("table");
            var selecteditem = table.getSelectedItem();
            var context = selecteditem.getBindingContext();
            this._Ocontext = context;
            var obj = context.getObject();
            var id = obj.ID;
            var name = obj.name;
            var country = obj.country;
            // this.byId("editid").setValue(id);
            this.byId("editname").setValue(name);
            this.byId("editcountry").setValue(country);
            this.byId("editdialog").open();

        },
        editcancel: function () {
            this.byId("editdialog").close();
            _this.cleardialoginput();
        },
        update: function () {
            var context = this._Ocontext;
            context.setProperty("name", this.byId("editname").getValue());
            context.setProperty("country", this.byId("editcountry").getValue());
            this.byId("editdialog").close();
        },
        delete: function () {
            var table = this.byId("table");
            var selected = table.getSelectedItem();
            var context = selected.getBindingContext();
            context.delete();
        },



        filterid: function (oEvent) {
                        var val = oEvent.getParameter("value");
            console.log(val);
            var val = this.getView().byId("filterid").getValue();
            console.log(val);
            var table = this.byId("table").getBinding("items");
            if (val) {
                var filter = new sap.ui.model.Filter({
                    path: "ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: val
                });
                table.filter(filter);
            }
            else {
                table.filter([]);
            }

        },


        filtername: function (oEvent) {
            var value = oEvent.getParameter("value");
            if (!value) {
                // Clear filters or reset table
                var table = this.getView().byId("table");
                table.getBinding("items").filter([]);
            }
        },

        namefilter: function (oEvent) {
            var table = this.getView().byId("table");
            var object = table.getItems();
            var distcountry = [];
            for (let i = 0; i < object.length; i++) {
                var country = object[i].getBindingContext().getObject().country;
                if (!distcountry.includes(country)) {
                    distcountry.push(country);
                }
            }
            var oModel = new sap.ui.model.json.JSONModel({
                country: distcountry
            });
            this.getView().setModel(oModel, "countryModel");
            if (!this._dialogbox) {
                this._dialogbox = sap.ui.xmlfragment("crud.view.filtercountry", this);
                this.getView().addDependent(this._dialogbox);

            }
            this._dialogbox.open();
        },

        onCountrySelected: function (oEvent) {

            // 1️⃣ Get selected row from the event
            var selectedItem = oEvent.getParameter("listItem");

            // 2️⃣ Get the data from the binding context
            var country = selectedItem.getBindingContext("countryModel").getObject();
            console.log(country);
            var table = this.getView().byId("table");
            var bindings = table.getBinding("items");



            if (country) {
                var filters = new sap.ui.model.Filter({
                    path: "country",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: country,
                })

                bindings.filter([filters]);
                this.getView().byId("filtercountryinput").setValue(country);
            } else {
                bindings.filter([]);
            }
            this._dialogbox.close();

        }

    });
});