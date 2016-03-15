(function (controller) {
    
    var data = require("../dataService");

    controller.init = function (app) {

        app.get("/api/notes/:categoryName", function (req, res) {
            
            var categoryName = req.params.categoryName;            

            data.getNotes(categoryName, function (err, notes) {
                
                if (err) {
                    res.send(400, err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(notes.notes);
                }
                
            });
            
            
        });

        app.post("/api/notes/:categoryName", function (req, res) {

            var categoryName = req.params.categoryName;
            
            var noteToInsert = {
                note: "",
                color: "yellow",
                author: "Kaladin"
            };

            data.addNotes(categoryName, noteToInsert, function (err) {
                if (err) {
                    res.send(400, "Failed tp add note");
                } else {
                    res.set("Content-Type", "spplication/json");
                    res.send(201, noteToInsert);
                }

            });
        });
    };

})(module.exports);