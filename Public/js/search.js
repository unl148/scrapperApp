$("#NewArticles").on("click", ()=>{
    $.get("/articles", function( data ) {
        $("#articles").append(data);
        console.log(data);
        alert( "Load was performed." );
      });
});

$(document).on('click', '.saveArticle', function() {
//$(".saveArticle").delegate("a", "click", function(){
//$(".saveArticle a").on("click", ()=>{
  var id = $(this).data("article-id");
  console.log("button clicked");
  $.post("/api/saveArticle/"+ id);
});

