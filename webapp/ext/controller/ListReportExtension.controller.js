sap.ui.controller("ca.cop.zamassetreport.ext.controller.ListReportExtension", {

	onInit: function () {
		this._oTable = this.getView().byId("GridTable");

		this._oTable.attachRowSelectionChange(
			function (oEvent) {
				this._iIndex = oEvent.getSource().getSelectedIndex();
			}.bind(this)
		);
	},

	onAfterRendering: function (oEvent) {
		this._oTable.attachBusyStateChanged(this._onBusyStateChanged);
	},

	_onBusyStateChanged: function (oEvent) {
		var bBusy = oEvent.getParameter("busy");

		if (!bBusy && !this._bColumnOptimizationDone) {
			var oTable = oEvent.getSource();
			var oTpc = null;

			if (sap.ui.table.TablePointerExtension) {
				oTpc = new sap.ui.table.TablePointerExtension(oTable);
			} else {
				oTpc = new sap.ui.table.extensions.Pointer(oTable);
			}

			var aColumns = oTable.getColumns();

			for (var i = aColumns.length; i >= 0; i--) {
				oTpc.doAutoResizeColumn(i);
			}
		}
	},

	onCreateAsset: function () {
		this._fnNavToApp("CreateAsset");
	},

	onEditAsset: function () {
		this._fnNavToApp("ChangeAsset");
	},

	onDisplayAsset: function () {
		this._fnNavToApp("DisplayAsset");
	},

	onAssetHistory: function () {
		this._fnNavToApp("AssetHistory");
	},

	_fnNavToApp: function (sApp) {
		var oCrossAppNavigator;

		if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
			oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var oTarget = {
				target: {
					semanticObject: sApp,
					action: "display"
				}
			};

			if (sApp !== "CreateAsset") {
				var aAssetNum = this._iIndex > -1 ?
					this._oTable.getContextByIndex(this._iIndex).getObject().Anln1 : "";

				oTarget.params = {
					AssetNum: aAssetNum
				};
			}

			oCrossAppNavigator.toExternal(oTarget);
		}
	},
});