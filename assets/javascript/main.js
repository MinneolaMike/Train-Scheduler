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
    $("#savetrain").on("click", function (event) {

        // Variables from the Add Train Input Fields
        var name = $("#trainname").val().trim();
        var destination = $("#destination").val().trim();
        var frequency = $("#frequency").val();
        var firstArrival = moment($("#arrival").val().trim(), "HH:mm").format("X");

        // Creates temporary object to hold the New Train Added
        var newTrain = {
            name: name,
            destination: destination,
            frequency: frequency,
            firstArrival: firstArrival
        };

        // Uploads New Train data to the database
        database.ref().push(newTrain);

        // Clears all of the Input Fields
        $("#trainname").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#arrival").val("");

    });

    // Function to add everything to firebase and DOM manipulation
    database.ref().on("child_added", function (childSnapshot) {
        
        // Store everything into a variable.
        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var firstArrival = childSnapshot.val().firstArrival;
              
        // First Time converted back 1 hour to make sure it comes before the actual time
        var firstArrivalConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
        // Current Time taken from the moment.js database
        var currentTime = moment();
        // Difference between the times
        var timeDiff = moment().diff(moment(firstArrivalConverted), "minutes");
        // Variable for the remainder
        var remainder = timeDiff % frequency;
        // Minute Until Train
        var minutesAway = frequency - remainder;
        // Next Train
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway),
        );

        // Append the new row to the table
        $("#trainschedule > tbody").append(newRow);

        //Calling the function sort table
        sortTable();
    });

    // Function to sort the table by minutes away from departure
    function sortTable() {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("trainschedule");
        switching = true;
        // Makes a continuous loop to allow switching to be made till needed
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            // Loop through all the rows except header row
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                // Grab the 2 elements you want to compare -- in this case index 3 (minutes away)
                x = rows[i].getElementsByTagName("TD")[3];
                y = rows[i + 1].getElementsByTagName("TD")[3];
                //check if the two rows should switch place:
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                // If a switch has been made put it in the row above
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

});