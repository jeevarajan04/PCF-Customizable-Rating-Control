
import { IInputs, IOutputs } from "./generated/ManifestTypes";

import * as $ from 'jquery';

let emoji = ["fas fa-dizzy", "fas fa-sad-tear", "fas fa-meh", "fas fa-smile", "fas fa-grin-stars"];
let emojiCount = 0;
let hoverNormal = ["#ff070747", "#ec700340", "#ffd50452", "#c2ff1d69", "#30ff0052"];
let hoverHighlight = ["#ff0707", "#ec7003", "#ffd504", "#c2ff1d", "#30ff00"];
let drpDown = ["line", "star", "heart", "emoji"];
let list = [1, 2, 3, 4, 5];

export class RatingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _context: ComponentFramework.Context<IInputs>;
	private _ratingDrpProperty: string;
	private _ratingValueProperty: number;
	private _notifyOutputChanged: () => void;

	private _select: HTMLDivElement;
	private _container: HTMLDivElement;
	private _div: HTMLDivElement;
	private _span: HTMLSpanElement;
	private _label: HTMLLabelElement;

	private _css: HTMLLinkElement;

	private _bootstrapScript: HTMLScriptElement;
	private _bootstrapCss: HTMLLinkElement;

	private _divRow: HTMLDivElement;
	private _divColDummy: HTMLDivElement;
	private _divCol: HTMLDivElement;
	private _list_group: HTMLDivElement;
	private _grid: HTMLDivElement;
	private _grid_Item: HTMLDivElement;

	private _selectDrp: HTMLSelectElement;
	private _optionDrp: HTMLOptionElement;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		// Add control initialization code
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._ratingDrpProperty = context.parameters.ratingDrpProperty.raw != "" ? context.parameters.ratingDrpProperty.raw : "line";
		this._ratingValueProperty = context.parameters.ratingValueProperty.raw != null ? context.parameters.ratingValueProperty.raw : 0;
		
		//Rating dropdown 
		this._select = document.createElement("div");
		this._selectDrp = document.createElement("select");
		this._selectDrp.id = "selectDrp";
		this._selectDrp.addEventListener("change", this.onDrpClick.bind(this));
		drpDown.forEach(element => {
			this._optionDrp = document.createElement("option");
			this._optionDrp.value = String(element);
			this._optionDrp.innerHTML = String(element);
			this._optionDrp.id = element;
			this._selectDrp.appendChild(this._optionDrp);
		});

		this._divRow = document.createElement("div");
		this._divRow.setAttribute("class", "row");

		this._divColDummy = document.createElement("div");
		this._divColDummy.setAttribute("class", "col-4");
		this._divColDummy.appendChild(this._selectDrp);

		this._divCol = document.createElement("div");
		this._divCol.setAttribute("class", "col-6");

		this._list_group = document.createElement("div");
		this._list_group.className = "list-group";
		this._grid = document.createElement("div");
		this._grid.innerHTML = this._ratingDrpProperty.toString().toUpperCase() + " RATING";
		this._grid.className = "list-group-item active " + this._ratingDrpProperty + "-rating-grid";
		this._grid_Item = document.createElement("div");
		this._grid_Item.className = "list-group-item line-rating-grid-item " + this._ratingDrpProperty + "-rating-grid-item";
		this._grid_Item.id = "Grid_Item";

		this._divRow.appendChild(this._divColDummy);
		this._divRow.appendChild(this._divCol);
		this._divCol.appendChild(this._list_group);
		this._list_group.appendChild(this._grid);
		this._list_group.appendChild(this._grid_Item);

		//Select Span 
		for (let value of list) {
			this._span = document.createElement("span");
			this._span.setAttribute("value", String(value));
			this._span.id = String(value);
			var fontImage = this.fontImage(this._ratingDrpProperty);
            var IsHover = this._ratingValueProperty>value ? "-hover" :"-normal" ;
			this._span.className = fontImage + " fa-3x margin-right " + this._ratingDrpProperty + IsHover;
			this._span.addEventListener("mouseover", this.onHover.bind(this, value));
			this._select.appendChild(this._span);
		}

		this._container = document.createElement("div");
		this._bootstrapCss = document.createElement("link");
		this._css = document.createElement("link");
		this._bootstrapScript = document.createElement("script");
		this._div = document.createElement("div");

		this._bootstrapScript.src = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js";
		this._bootstrapCss.rel = "stylesheet";
		this._bootstrapCss.setAttribute("href", "https://use.fontawesome.com/releases/v5.8.2/css/all.css");

		this._css.rel = "stylesheet";
		this._css.setAttribute("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");
		this._container.appendChild(this._bootstrapScript);
		this._container.appendChild(this._bootstrapCss);
		this._container.appendChild(this._css);

		this._grid_Item.appendChild(this._select);

		this._label = document.createElement("label");
		this._label.id = "label";
		this._grid_Item.appendChild(this._label);

		this._div.appendChild(this._divRow);
		this._container.appendChild(this._div);

		container.appendChild(this._container);

	}

	onHover(value: any): void {
		emojiCount = 0;
		let drpDownValue = $("#selectDrp").val();
		let list = [1, 2, 3, 4, 5];
		let reverse: boolean = $("#" + value).hasClass(drpDownValue + "-normal");
		if (value == 1 && reverse)
			this._label.innerHTML = "";
		else
			this._label.innerHTML = value;

		for (var row = 1; row <= list.length; row++) {
			let switchClass: any = [];
			if (row <= value)
				switchClass = [drpDownValue + "-normal", drpDownValue + "-hover"];
			else
				switchClass = [drpDownValue + "-hover", drpDownValue + "-normal"];
			if (switchClass) {
				$("#" + row).removeClass(switchClass[0]);
				$("#" + row).addClass(switchClass[1]);
				if (drpDownValue == "emoji") {
					if (row <= value) $("#" + row).css("color", hoverHighlight[emojiCount]);
					else $("#" + row).css("color", hoverNormal[emojiCount]);
					emojiCount++;
				}
			}
		}

		this._ratingValueProperty = value.toString();
		this._notifyOutputChanged();
	}

	onDrpClick() {

		let selectDrp = $("#selectDrp").val();
		this.drpOnchange(String(selectDrp));
	}

	fontImage(ratingDrpProperty: string): string {
		switch (ratingDrpProperty) {
			case "star": return "fas fa-star"
			case "line": return "fas fa-minus"
			case "heart": return "fa fa-heart"
			default: return "fas fa-minus"
		}
	}

	drpOnchange(selectDrp: String) {
		this._label.innerHTML = "";
		this._grid.innerHTML = selectDrp.toUpperCase() + " RATING";

		this._grid.className = "list-group-item active " + selectDrp + "-rating-grid";
		this._grid_Item.className = "list-group-item line-rating-grid-item " + selectDrp + "-rating-grid-item";
		let list = [1, 2, 3, 4, 5];
		let image = this.fontImage(selectDrp.toString());
		list.forEach(element => {
			$("#" + element).removeClass();
			if (selectDrp != "emoji")
				$("#" + element).addClass(image + " fa-3x margin-right " + selectDrp + "-normal");
			else {
				$("#" + element).addClass(emoji[emojiCount] + " fa-3x margin-right " + selectDrp + "-normal");
				$("#" + element).css("color", hoverNormal[emojiCount]);
				emojiCount++;
			}
		});

		this._ratingDrpProperty = selectDrp.toString();
		this._ratingValueProperty = 0;
		this._notifyOutputChanged();

	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		this._ratingDrpProperty = context.parameters.ratingDrpProperty.raw;
		this._ratingValueProperty = context.parameters.ratingValueProperty.raw;
		this._context = context;
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			ratingDrpProperty: this._ratingDrpProperty,
			ratingValueProperty: this._ratingValueProperty
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}