$("#NewArticles").on("click", ()=>{
    $.get("/articles", function( data ) {
      $("#articles").empty();
        $("#articles").append(data);
        console.log(data);
        
      });
});

$(document).on('click', '.saveArticle', function() {
//$(".saveArticle").delegate("a", "click", function(){
//$(".saveArticle a").on("click", ()=>{
  var id = $(this).data("article-id");
  console.log("button clicked");
  $.post("/api/saveArticle/"+ id);
});

$("#savedArticles").on("click", ()=>{
  $("#articles").empty();
  $.get("/savedArticles", function( data ) {
      $("#articles").append(data);
      console.log(data);
    });
});
