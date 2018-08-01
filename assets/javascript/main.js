// Initialize Firebase
var config = {
    apiKey: "AIzaSyAWCjx49FBw4obWw9wJPNPZiGXo-3dS7ls",
    authDomain: "train-scheduler-bfead.firebaseapp.com",
    databaseURL: "https://train-scheduler-bfead.firebaseio.com",
    projectId: "train-scheduler-bfead",
    storageBucket: "train-scheduler-bfead.appspot.com",
    messagingSenderId: "7919516478"
};
firebase.initializeApp(config);

// Document Ready Function
$(document).ready(function () {

    // Setting Variable Database = Firebase Database
    var database = firebase.database();

    // Capture Button Click for Add Train
    $("#saveTrain").on("click", function (event) {
        event.preventDefault();

        // Variables from the Add Train Input Fields
        var name = $("#trainname").val().trim();
        var destination = $("destination").val().trim();
        var frequency = $("#frequency").val().trim();
        var nextArrival = moment($("#arrival").val().trim(), "HH:mm").format("X");

        // Creates temporary object to hold the New Train Added
        var newTrain = {
            name: name,
            destination: destination,
            frequency: frequency,
            nextArrival: nextArrival
        };

        // Uploads New Train data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.frequency);
        console.log(newTrain.nextArrival);

        // alert("Employee successfully added");

        // Clears all of the Input Fields
        $("#trainname").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#arrival").val("");

    });

    //


});