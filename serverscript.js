// DATABASE PERSISTENCE EXAMPLE

// Retreive data from the database
function getData() {
    var queryResult = db.Execute('SELECT * FROM sampleTable');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"error":"Table does not exist"}';
    }
    return queryResult;
}

// Create talbe
function createTable() {
    var debug = {};

    var queryResult = db.Execute('SELECT TOP 1 * FROM sampleTable');
    var row = JSON.parse(queryResult);

    if (row.length > 0 && typeof row[0].Error != 'undefined') {
        db.Execute('CREATE TABLE sampleTable(id INTEGER PRIMARY KEY IDENTITY(1,1), userId nvarchar(50), value nvarchar(50));');
        debug.result = "created table!";
    } else
        debug.result = "table already exists";

    return JSON.stringify(debug);
}

// Insert into the database
function insert() {
    if (args.Get("value").length > 50)
        return '{"result":"error"}';
    else {
        db.Execute('INSERT INTO sampleTable VALUES(@currentUser,@value)');
        return getData();
    }
}

// OPEN DATA API EXAMPLE

function getOpenData() {
    var apiKey = ""; // Paste your API key here.
    if (apiKey == "")
        return '{"error":"No Api Key! Add your key in the server script file."}';

    return proxy.GetProxy('https://api.uwaterloo.ca/v2/foodservices/watcard.json?key=' + apiKey);
}