//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://admin:p5W5Rvr28zzQAhWE@cluster0.bp2y7j1.mongodb.net/Journal')
const app = express();
const mongoSchema=new mongoose.Schema({
  title:
  {
    type:String,
    
    
  },
  content:{
    type:String,
    
    
  }
})
const journalElement=mongoose.model("another",mongoSchema)
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",async function(req, res){
  
  res.render("home", {
    startingContent: homeStartingContent,
    
    posts:await journalElement.find({},{_id:0,title:1,content:1})
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const newOne=new journalElement({title:req.body.postTitle,content:req.body.postBody})
  newOne.save().then(()=>console.log('New item has been saved to the database successfully'))
  // const post={title:req.body.postTitle,content:req.body.postBody}
  // posts.push(post)
  res.redirect("/");
});
const commentsSchema=new mongoose.Schema({
  name:String,
    username:String,
  comment:String
})
const commentModel=mongoose.model('Comment',commentsSchema)
app.post("/post",async function(req,res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const name=req.body.name
  const username=req.body.username
  const comments=req.body.comments
  const newComment=new commentModel({
    name:name,
    username:username,
    comment:comments
  })
  
  newComment.save().then(() => console.log('posted'))
  
  res.redirect(req.get('referer'));
})
app.get("/posts/:postName",async function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  var search=await journalElement.find({},{_id:0,title:1,content:1})
  var commentSearch=await commentModel.find({},{_id:0,name:1,comment:1})
  commentSearch.forEach(function(comment){
    
  
  search.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content,
        name:comment.name,
        comment:comment.comment
      });
    }
  });

});

})



























app.listen(3000, function() {
  console.log("Server started on port 3000");
});
