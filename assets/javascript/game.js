
//reference to the database
var database = firebase.database();

//empty objects for the two players
var player1 = null;
var player2 = null;

//players' names
var player1Name = "";
var player2Name = "";

// Store your name
var yourName = "";

// Store the player choices
var player1Choice = "";
var player2Choice = "";

//Data base listener to add players info to html
database.ref("/players/").on("value", function (snapshot) {
  //Checks to see if player one exists within firebase
  if (snapshot.child("player1").exists()) {
    console.log("player 1 exists")
    //store player1 object to variable
    player1 = snapshot.val().player1;
    player1name = player1.name;
    player1win = player1.win;
    player1loss = player1.loss
    player1tie = player1.tie;
    //displays player 1 name,win,loss,ties
    $("#player1name").text(player1name);
    $("#player1wins").text(player1win);
    $("#player1losses").text(player1loss);
    $("#player1ties").text(player1tie);
  } else {
    console.log("player 1 does not exist")
  }
  //Checks to see if player two exists within firebase
  if (snapshot.child("player2").exists()) {
    console.log("player 2 exists")
    //store player2 object to variable
    player2 = snapshot.val().player2;
    player2name = player2.name;
    player2win = player2.win;
    player2loss = player2.loss
    player2tie = player2.tie;
    //displays player 1 name,win,loss,ties
    $("#player2name").text(player2name);
    $("#player2wins").text(player2win);
    $("#player2losses").text(player2loss);
    $("#player2ties").text(player2tie);
  } else {
    console.log("player 2 does not exist")
  }
});

//Adding name and creating conent for player 1 & 2 object in firebase
$("#name-submit").on("click", function (event) {
  console.log("name submit button clicked")
  event.preventDefault();

  if (player1 === null) {
    console.log("Adding Player 1");

    yourName = $("#your-name").val().trim();

    player1 = {
      name: yourName,
      win: 0,
      loss: 0,
      tie: 0,
      choice: ""
    };

    database.ref().child("/players/player1").set(player1);
    $("#your-name").val("");

  }
  else if (player1 !== null && player2 === null) {
    console.log("Adding Player 2");

    yourName = $("#your-name").val().trim();

    player2 = {
      name: yourName,
      win: 0,
      loss: 0,
      tie: 0,
      choice: ""
    };

    database.ref().child("/players/player2").set(player2);
    $("#your-name").val("");
  }
});
console.log("yourname:", yourName);
//Event listener for player 1 choices
$(".player1btn").on("click", function (event) {
  console.log("player 1 button choice click works")
  event.preventDefault();
  var choice1 = $(this).html();
  // Record the player choice into the database
  player1Choice = choice1;
  database.ref().child("/players/player1/choice").set(choice1);
  console.log("player1choice:", player1Choice);
});
//Event listener for player 2 choices
$(".player2btn").on("click", function (event) {
  console.log(" player 2 button choice click works")
  event.preventDefault();
  var choice2 = $(this).html();
  // Record the player choice into the database
  player2Choice = choice2;
  database.ref().child("/players/player2/choice").set(choice2);
  console.log("player2choice:", player2Choice);
  //calls the function that contains the game logic
  RPSLS();
})

//function that determine the logic behind RPSLS
function RPSLS() {
  //logic that would determine player 1 as winner
  if ((player1.choice === "Rock" && (player2.choice === "Scissors" || player2.choice === "Lizard")) ||
    (player1.choice === "Scissors" && (player2.choice === "Paper" || player2.choice === "Lizard")) ||
    (player1.choice === "Paper" && (player2.choice === "Rock" || player2.choice === "Spock")) ||
    (player1.choice === "Lizard" && (player2.choice === "Spock" || player2.choice === "Paper")) ||
    (player1.choice === "Spock" && (player2.choice === "Rock" || player2.choice === "Scissors"))) {
    //adds 1 to player 1 win and adds loss to player 2
    database.ref().child("/players/player1/win").set(player1.win + 1);
    database.ref().child("/players/player2/loss").set(player2.loss + 1);
    //pushes wins loses for player 1 and 2 to html
    // database.ref("/players/player1/win").on("child_changed",function(snapshot){
    // $("#player1wins").html(player1.win);
    // $("#player2losses").html(player2.loss);
    // console.log("player 1 wins")
    // });
  }
  //logic that would determine player 1 as winner
  else if ((player2.choice === "Rock" && (player1.choice === "Scissors" || player1.choice === "Lizard")) ||
    (player2.choice === "Scissors" && (player1.choice === "Paper" || player1.choice === "Lizard")) ||
    (player2.choice === "Paper" && (player1.choice === "Rock" || player1.choice === "Spock")) ||
    (player2.choice === "Lizard" && (player1.choice === "Spock" || player1.choice === "Paper")) ||
    (player2.choice === "Spock" && (player1.choice === "Rock" || player1.choice === "Scissors"))) {
    //adds 1 to player 2 win and adds loss to player 1
    database.ref().child("/players/player2/win").set(player2.win + 1);
    database.ref().child("/players/player1/loss").set(player1.loss + 1);
    //pushes wins loses for player 1 and 2 to html
    // $("#player2wins").html(player2.win);
    // $("#player1losses").html(player1.loss);
    console.log("player 2 wins")
  }
  //logic that determines tie
  else if (player1.choice === player2.choice) {
    database.ref().child("/players/player2/tie").set(player2.tie + 1);
    database.ref().child("/players/player1/tie").set(player1.tie + 1);
    //pushes ties for player 1 and 2 to html
    $("#player1ties").html(player2.tie);
    $("#player2ties").html(player1.tie);
    console.log("tie game")
  }
}

//changing the win/loss in the html when firebase is adjusted
database.ref("/players/player1/win").on("child_added", function (snapshot) {
  var newWin = snapshot.val();
  console.log("win" + newWin.win);
  $("#player1wins").html(player1.win);
  $("#player2losses").html(player2.loss);
  console.log("player 1 wins")
});


//chat feature
//set event listener for chat submit button
$("#chat-submit").on("click", function (event) {
  console.log("chat submit button works")
  event.preventDefault();
  if ( (yourName !== "") && ($("#chat-message").val().trim() !== "") ) {
    var userMessage = (`${yourName} : ${$("#chat-message").val().trim()}`);
    database.ref("/chat/").set(userMessage);
    $("#chat-message").val("");
//     database.ref("/chat/").on("value", function (snapshot) {
//       console.log(snapshot.val())
//     // var userMessage = (`${yourName} : ${$("#chat-message").val().trim()}`);
//     // // database.ref("/chat/").set(userMessage);
//     // $("#chat-message").val("");
//     // if (snapshot.ref("/chat/").exists()) {
//     //   console.log("chat exists")
//     //   // console.log(snapshot.child("/chat/"))
//       var addChat = snapshot.val();
//     //   console.log(addChat)
//     $("#chat-area").append(`${addChat}<br>`);
//     // }
//     // $("#chat-message").empty();
// //look into keys?
//   });
}
});
database.ref("/chat/").on("value", function (snapshot) {
  console.log(snapshot.val())
// var userMessage = (`${yourName} : ${$("#chat-message").val().trim()}`);
// // database.ref("/chat/").set(userMessage);
// $("#chat-message").val("");
// if (snapshot.ref("/chat/").exists()) {
//   console.log("chat exists")
//   // console.log(snapshot.child("/chat/"))
  var addChat = snapshot.val();
  if(addChat){
//   console.log(addChat)
$("#chat-area").append(`${addChat}<br>`);

}
// $("#chat-message").empty();
//look into keys?
});

//hitting the reset button will clear players thread from firebase and reload the html on the page
$("#reset").on("click", function () {
  console.log("reset button clicked")
  database.ref("/players/").remove();
  database.ref("/chat/").remove();
  // location.reload();
  $("#player1name").empty();
  $("#player2name").empty();

});
