exports.findAll = function(req, res) {
    res.send([{name: 'song1'}, {name: 'song2'}, {name: 'song3'}]);
};


exports.findById = function(req, res) {
    res.send({id: req.params.id, name: "The Name", description: "description"});
};