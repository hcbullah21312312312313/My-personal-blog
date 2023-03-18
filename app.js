//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
let day=date.getDay();
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:p5W5Rvr28zzQAhWE@cluster0.bp2y7j1.mongodb.net/Journal"
);
const app = express();
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}
const mongoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});
const journalElement = mongoose.model("another", mongoSchema);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,

    posts: await journalElement.find({}, { _id: 0, title: 1, content: 1 }).sort({_id:-1})
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const newOne = new journalElement({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  newOne
    .save()
    .then(() =>
      console.log("New item has been saved to the database successfully")
    );
  // const post={title:req.body.postTitle,content:req.body.postBody}
  // posts.push(post)
  res.redirect("/");
});
const commentsSchema = new mongoose.Schema({
  firstName: String,
  username: String,
  opinion: String,
  title: String,
  time:String
  }
);
const commentModel = mongoose.model("Comment", commentsSchema);
app.post("/post", async function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  const name = req.body.name;
  const username = req.body.username;
  const comments = req.body.comments;
  const titleq = req.body.label;
  const newComment = new commentModel({
    firstName: name,
    username: username,
    opinion: comments,
    title: titleq,
    time:day
  });

  newComment.save().then(() => console.log("posted"));

  res.redirect(req.get("referer"));
});
app.get("/posts/:postName", async function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedTitlez = titleCase(requestedTitle);
  var search = await journalElement.find({}, { _id: 0, title: 1, content: 1 });
  var titleList = [];
  search.forEach(function (POST) {
    titleList.push(POST.title);
  });
  var commentSearchRaw = await commentModel.find(
    { title: requestedTitlez },
    { _id: 0, firstName: 1, opinion: 1, title: 1 }
  );
  var commentSearch = [];
  commentSearchRaw.forEach(function (comment) {
    commentSearch.push(comment);
    
  });

  search.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      var titleFinal = titleCase(post.title);
      res.render("post", {
        title: titleFinal,
        content: post.content,
        comments: commentSearchRaw,
      });
    }
  });
});
app.get('/admin',async function(req,res){
  let netComments=[]
  const comments=await commentModel.find({}).sort({_id: -1}).limit(10);
  comments.forEach(function(comment){
     netComments.push(comment);
  })
  
  const messege=await messeges.find({}).sort({_id: -1}).limit(10)

  const previousPosts=[]
  const  prevPosts=await journalElement.find({}).sort({_id: -1}).limit(4)
  console.log(msgsnu)
  res.render('admin',{comments: netComments,PreviousPosts:prevPosts,messages:messege});})
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

const messegeSchema=new mongoose.Schema({
  name:String,
  messege:String,
  time:String,
  email:String
})
const messeges= mongoose.model('Messege',messegeSchema)
msgsnu=messeges.countDocuments({})

app.post('/', function (req, res) {
  const name=req.body.name
  const email=req.body.email
  const messege=req.body.message
  const newMessege=new messeges({
    name:name,
    messege:messege,
    email:email,
    time:day
  })
  console.log(name)
  newMessege.save().then(() => console.log("The message is sent to the server"));
  res.redirect('/')
})
app.get('/comments',async function(req, res) {
  const commentsScreen=await commentModel.find({}).sort({_id: -1})
    res.render('comments', {comments:commentsScreen})
})

// Define messages route
app.get("/messages", async function (req, res) {
  const messagesScreen = await messeges.find({}).sort({ _id: -1 });
  res.render("messeges", { messages: messagesScreen, name: titleFinal });
});
app.get("/posts", async function (req, res) {
  const messagesScreen = await messeges.find({}).sort({ _id: -1 });
  res.render("messeges", { messages: messagesScreen, name: titleFinal });
});