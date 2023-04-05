/*
  Script with GUI for Adobe Illustrator
  Author: Felhazi Lorand - 2022
  Description: A script that does everything... "We need"-> Developed for the Assembly Directions Team.
  Steelcase - Cluj-Napoca
*/

var doc = app.activeDocument;

if (app.documents.length > 0) {
    var arrClippingMasks = [];
    //Create Main Window
    var dialog = new Window("dialog");
    dialog.text = "Script with GUI";
    dialog.orientation = "column";
    dialog.alignChildren = "left";
    dialog.spacing = 10;
    dialog.margins = 10;
    //Checkbox
    var checkbox1 = dialog.add("radiobutton");
    checkbox1.text = "Page Numbering";
    var checkbox2 = dialog.add("radiobutton");
    checkbox2.text = "Group All Artboard";
    var checkbox3 = dialog.add("radiobutton");
    checkbox3.text = "Ungroup All in Document";
    var checkbox4 = dialog.add("radiobutton");
    checkbox4.text = "Prepare Model";
    var checkbox5 = dialog.add("radiobutton");
    checkbox5.text = "Selection (Only .dwg)";
    var ok = dialog.add("button", undefined, "Ok", {
        name: "OK"
    });
    ok.onClick = okClick;

    var copyright = dialog.add("statictext", undefined, '\u00A9 Felhazi Lorand, Steelcase.com');
    copyright.justify = 'center';
    copyright.enabled = false;

    //Show
    dialog.show();

} else {
    alert('Please open a document before running this script!');
}

function okClick() {
    //Page Numbering Script
    if (checkbox1.value) {
        doc.layers.add();
        for (var i = 0; i < doc.artboards.length; i++) // loop through all artboards
        {
            //Get sizes of the artboard
            var artboard = doc.artboards[i];
            var aRect = artboard.artboardRect;
            //Artboard parameters as variables
            var aLeft = aRect[0]; //left site of a page
            var aTop = aRect[1]; //top of a page
            var aRight = aRect[2]; //right site of a page
            var aBottom = aRect[3]; //bottom of a page
            var aWidth = aLeft + aRight; //width of a page
            var aCenter = aWidth / 2; //center of a page
            //Text Justification
            var center = Justification.CENTER; //Justification center
            var left = Justification.LEFT; //Justification left
            var right = Justification.RIGHT; //Justification right
            //PAGES
            var pageText = 'Page ' + (i + 1) + ' of ' + doc.artboards.length; // page 1 of 1 pages

            var pages = doc.textFrames.add();
            pages.contents = pageText; //"page 1 of 1";				
            pages.position = [aRight - 28, aBottom + 52]; //Position (here at center of page)

            var pageStyle = pages.textRange.characterAttributes;
            pageStyle.size = 11; //size in punkt
            pageStyle.textFont = textFonts.getByName("Helvetica"); //the font

            var justPageText = pages.textRange.paragraphAttributes;
            justPageText.justification = right; //Justification     
        }
        doc.activeLayer.locked = true;
        dialog.close();
    }

    //Group All on an Artboard
    if (checkbox2.value) {
        for (var i = 0; i < doc.artboards.length; i++) {
            //activate artboards
            doc.artboards.setActiveArtboardIndex(i);
            //select all items from active artboard
            doc.selectObjectsOnActiveArtboard();
            //group everything from an artboard
            app.executeMenuCommand('group');
        }
        dialog.close();
    }

    //Ungroup All in Document
    if (checkbox3.value) {
        function Recursiv(aux) {
            for (var i = 0; i <= aux; i++) {
                // select a 'Group' type element
                doc.groupItems[i].selected = true;
                app.executeMenuCommand('ungroup');
            }
            //if there are no more elements -> exit
            if (aux == 0) {
                dialog.close();
            } else {
                Recursiv(aux);
            }
        }
        Recursiv(doc.groupItems.length);
        dialog.close();
    }

    //Prepare the Graphic
    if (checkbox4.value) {
        var a_items = doc.pageItems;
        for (var i = 0; i < a_items.length; i++) {
            //set stroke to 0.25 for all objects on artboard
            a_items[i].strokeWidth = 0.25;
            //release clripping mask
            if (a_items[i].clipping == true) {
                a_items[i].remove();
            }
        }
        dialog.close();
    }

    //Selection Tool for .dwg
    if (checkbox5.value) {
        //selection funtion to select an object with a certain name
        function select(name) {
            for (i = 0; i < doc.pageItems.length; i++) {
                if (doc.pageItems[i].name == name) {
                    doc.pageItems[i].selected = true;
                }
            }
        }

        function deselect() {
            for (i = 0; i < doc.pageItems.length; i++) {
                doc.pageItems[i].selected = false;
            }
        }

        select("SPLINE");
        app.executeMenuCommand("group");
        deselect();

        select("ELLIPSE");
        app.executeMenuCommand("group");
        deselect();

        select("LINE");
        app.executeMenuCommand("group");
        deselect();

        select("ARC");
        app.executeMenuCommand("group");
        deselect();

        dialog.close();
    }
} //function OnClick() END