$(document).ready(function() {
    $(".error").hide();
    $(".success").hide();
    $(".loading").hide();
    loadCategories();

    currentlyLoggedInUser = StackMob.getLoggedInUser();
    if(currentlyLoggedInUser != null & new StackMob.User({ username: currentlyLoggedInUser }).isLoggedIn()) {
      $(".login").hide();
      $(".logout").show();
      $(".input").show();
      $(".logout a").text("Logout "+currentlyLoggedInUser);
      }
      else {
        $(".login").show();
        $(".logout").hide();
        $(".input").hide();
      }
});

/* development public key */
//publicKey: '808f8a8d-8c4b-48d3-948b-639ce550595c',

/* production public key */
//publicKey: '1fa23f54-c844-435d-89bf-d78b5915b377',

StackMob.init({
appName: 'winequiz',
clientSubdomain: 'ciryonmaccom',
publicKey: '808f8a8d-8c4b-48d3-948b-639ce550595c',
apiVersion : 0
});

var Card = StackMob.Model.extend({
schemaName : 'card' 
});

var Category = StackMob.Model.extend({
  schemaName: 'category'
});

var loadingOn = function() {
  $(".error").hide();
  $(".success").hide();
  $(".content").hide();
  $(".loading").show();
}

var loadingOff = function() {

  $(".content").show();
  $(".loading").hide();
}

var createcard = function() {
  loadingOn();
  var categoryId = $('select').find(":selected").val();

  var card = new Card({
question : $("#questionField").val(),
answer : $("#answerField").val(),
category : categoryId
});


card.create({
success : function(model) {

  //user.appendAndSave('chores', [chore1.get('todo_id')] );
  var theCategory = new Category({ category_id: categoryId });

  theCategory.appendAndSave('cards', [card.get('card_id')] );

console.debug(model.toJSON());
loadingOff();
$(".error").hide();
$(".success").show();
  $('.success').delay(1000).fadeOut('slow', function() {
    //$(".success").hide();
    });
$("#questionField").val("");
$("#answerField").val("");

},
error : function(model, response) {
loadingOff();
$(".error").show();
$(".success").hide();
console.debug("Error while creating object!");
$(".error p").text(response['error']);
console.debug(response);
}
});
}

var loadCategories = function() {

  var Categories = StackMob.Collection.extend({
    model: Category
  });
  var categories = new Categories();
 
  var q = new StackMob.Collection.Query();
  categories.query(q, {
    success: function(collection) {
    html = "";
    collection.forEach(function(item) {
      html += "<option value='" + item['id'] + "'>"+ item['attributes']['name'] + "</option>";

      fix_categories(item);
      });
      $('select').append(html);
    }, error: function(model, response) {
        alert("Error loading categories! See console for details.");

        console.debug(response);
    }
  });

}

var login = function() {
  loadingOn();
  username = $("#usernameField").val();
  password = $("#passwordField").val();
var user = new StackMob.User({ username: username, password: password });
user.login(false, {
success: function(model) {
loadingOff();
  $(".login").hide();
  $(".logout").show();
      $(".logout a").text("Logout "+username);
      $(".input").show();
  console.debug("Login success!");
},
error: function(model, response) {
loadingOff();

      $(".input").hide();
  console.debug("Login failed: "+response);
  alert("Login failed!");
}
});
 
};

var logout = function() {
  loadingOn();
  var user = new StackMob.User({ username: 'ciryon'});
  user.logout({success: function(model) {
        loadingOff();
        $(".login").show();
        $(".logout").hide();
      $(".input").hide();
        },error: function(model) {
        loadingOff();
        alert("Logout failed");
      }
});
}

var fix_categories = function (category) {
  
  if(category['attributes']['name'] === "Portugal") {

  console.debug("category:"+category['id']);

  
  var Cards = StackMob.Collection.extend({
    model: Card
  });
  var cards = new Cards();
 
  var q = new StackMob.Collection.Query();
  categories.query(q, {
    success: function(collection) {

      console.debug("cards: "+collection);
    }, error: function(model, response) {
        alert("Error loading categories! See console for details.");

        console.debug(response);
    }
  });


  }
}

