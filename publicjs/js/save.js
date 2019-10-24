$(document).on('click', '.deleteArticle', function() {
    //$(".saveArticle").delegate("a", "click", function(){
    //$(".saveArticle a").on("click", ()=>{
      var id = $(this).data("article-id");
      var parent = $(this).closest(".card");
      console.log("button clicked");
      $.post("/api/deleteArticle/"+ id, function(data){
        if(data.deleted === true){
          parent.remove();
        }
      });
    });
    $("#home").on('click', function() {
      $.get("/home", function(data){
        $("#articles").append(data);
      })
      });
    