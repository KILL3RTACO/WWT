$(document).ready(function() {
  wwt.init();

  var buttons = new wwt.Composite("", "buttons");
  var textboxes = new wwt.Composite("", "textboxes");
  var checkRadio = new wwt.Composite("", "checkRadio");
  var spinners = new wwt.Composite("", "spinners");
  var pickers = new wwt.Composite("", "pickers");
  var lists = new wwt.Composite("", "lists");
  var groups = new wwt.Composite("", "groups");
  var tabs = new wwt.Composite("", "tabs");
  var progress = new wwt.Composite("", "progressbars");

  //fun fact - Android version names (1.5 - 6.0.x)
  var items = [
    "Cupcake",
    "Donut",
    "Eclair",
    "Froyo",
    "Gingerbread",
    "Honeycomb",
    "Ice Cream Sandwich",
    "Jelly Bean",
    "KitKat",
    "Lolipop",
    "Marshmellow"
  ]

  //Buttons
  new wwt.Button(buttons, "buttonEnabled", "Button").setTooltip("I am a button!");
  new wwt.Button(buttons, "buttonDisabled", "Button").setEnabled(false);

  //ToggleButtons
  new wwt.ToggleButton(buttons, "togglebuttonEnabled", "ToggleButton").setTooltip("I am a toggle button!");
  new wwt.ToggleButton(buttons, "togglebuttonEnabledActive", "ToggleButton").setState(true);
  new wwt.ToggleButton(buttons, "togglebuttondDisabled", "ToggleButton").setEnabled(false);
  new wwt.ToggleButton(buttons, "togglebuttonActiveDisabled", "ToggleButton").setState(true).setEnabled(false);

  //ButtonGroup
  var bg1 = new wwt.ButtonGroup(buttons, "buttonGroupEnabled").setTooltip("This isn't shown!");
  var bg2 = new wwt.ButtonGroup(buttons, "buttonGroupDisabled").setEnabled(false);
  var tbg1 = new wwt.ButtonGroup(buttons, "toggleButtonGroupEnabled", true);
  var tbg2 = new wwt.ButtonGroup(buttons, "toggleButtonGroupDisabled", true).setEnabled(false);

  [bg1, bg2, tbg1, tbg2].forEach(function(e, i) {
    var title = (e.isToggle() ? "Toggle" : "") + "Button";
    var b1 = e.addButton("", title).setTooltip("I am a button (in a group)!");
    var b2 = e.addButton("", title);
    var b3 = e.addButton("", title);

    if(i >= 2){
      b1.setState(true);
      b3.setState(true);
    }
  });

  //Textboxes (single and multi)
  new wwt.Text(textboxes, "textEnabled").setPlaceholder("Text").setTooltip("I am a textbox!");
  new wwt.Text(textboxes, "textDisabled").setPlaceholder("Text").setEnabled(false);
  new wwt.Text(textboxes, "textMultiEnabled", "multi").setPlaceholder("Text").setTooltip("I am a (multi) textbox!");
  new wwt.Text(textboxes, "textMultiDisabled", "multi").setPlaceholder("Text").setEnabled(false);
  new wwt.Text(textboxes, "textPasswordEnabled", "password").setPlaceholder("Text").setText("Password").setTooltip("I am a (password) textbox!");
  new wwt.Text(textboxes, "textPasswordDisabled", "password").setPlaceholder("Text").setEnabled(false).setText("Password");

  //Radio buttons
  new wwt.Radio(checkRadio, "radioEnabled", "Radio").setGroup("radios").setTooltip("I am a radio button!");
  new wwt.Radio(checkRadio, "radioDisabled", "Radio").setGroup("radios").setEnabled(false);

  //Checkboxes
  new wwt.Check(checkRadio, "checkEnabled", "Check").setTooltip("I am a checkbox!");
  new wwt.Check(checkRadio, "checkDisabled", "Check").setEnabled(false);

  //Spinners
  new wwt.Spinner(spinners, "spinnerEnabled").setTooltip("I am a spinner!");
  new wwt.Spinner(spinners, "spinnerDisabled").setEnabled(false);

  //ColorPickers
  new wwt.ColorPicker(pickers, "colorPickerEnabled", {
    color: "#B91F1F",
    palette: ["red", "green", "blue"]
  }).setTooltip("I am a color picker!");
  new wwt.ColorPicker(pickers, "colorPickerDisabled").setEnabled(false);

  //FileChoosers
  new wwt.FileChooser(pickers, "fileChooserEnabled", "FileChooser").setTooltip("I am a filechooser!");
  new wwt.FileChooser(pickers, "fileChooserDisabled", "FileChooser").setEnabled(false);

  new wwt.List(lists, "listEnabled", items).setMultiSelect(true).setSelectedItems([8, 9]).setTooltip("I am a list!");;
  new wwt.List(lists, "listDisabled", items).setEnabled(false);

  new wwt.Combo(lists, "comboEnabled").setItems(items).setText("Ice Cream Sandwich").setTooltip("I am a combo!");;
  new wwt.Combo(lists, "comboDisabled").setItems(items).setText("KitKat").setEnabled(false);
  new wwt.Combo(lists, "comboEditableEnabled", true).setItems(items).setText("").setTooltip("I am an (editable) combo!");
  new wwt.Combo(lists, "comboEditableDisabled", true).setItems(items).setText("KitKat").setEnabled(false);

  // new wwt.YTVideo("videos", "ytPlayer", new wwt.YTVideo.Options("rnQBF2CIygg").setAutoPlay(false).setSize(500, 500));

  var tabs = new wwt.TabFolder(tabs, "tabsEnabled");
  tabs.append("Tab 1", "enabledTab1").append("<b>BOLD TEXT</b>").setTooltip("I am a tab in a tab folder!");
  tabs.append("Tab 2", "enabledTab2").append("<i>ITALIC TEXT</i>");
  var bigTab = tabs.append("Tab 3", "enabledTab3");
  new wwt.Button(bigTab, "buttonInsideTab", "Button");
  new wwt.Button(bigTab, "buttonInsideTab1", "Button");
  new wwt.Button(bigTab, "buttonInsideTab2", "Button");
  new wwt.Button(bigTab, "buttonInsideTab3", "Button");
  new wwt.Button(bigTab, "buttonInsideTab4", "Button");
  new wwt.Button(bigTab, "buttonInsideTab5", "Button");

  var table = new wwt.Table(lists, "table").setTooltip("I am a table!");;
  table.addHeader("Header by string");
  table.addHeader(new wwt.Table.Header("Header by class"));
  table.addRow(new wwt.Table.Row(["0,0", "1,0"]));
  table.addRow(["1,0", "1,1"]);

  var pb = new wwt.ProgressBar(progress, "progressEnabled").setTooltip("I am a progress bar!").setIndeterminate();

});
