const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const homeStartingContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const aboutContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut faucibus pulvinar elementum integer enim neque volutpat. Nullam ac tortor vitae purus faucibus ornare suspendisse. Nec tincidunt praesent semper feugiat nibh sed pulvinar. Ut consequat semper viverra nam libero justo laoreet sit amet. Nunc faucibus a pellentesque sit amet. Ac auctor augue mauris augue neque gravida in fermentum. Pharetra massa massa ultricies mi quis.';
const contactContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aenean et tortor at risus viverra adipiscing at in. Nisl nunc mi ipsum faucibus vitae. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Elit sed vulputate mi sit amet.';

const posts = [];

app.get("/", (req,res)=>{
    res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
    });
});

app.get("/posts/:postName", (req,res)=>{

    posts.forEach(post=>{
        const requestedTitle = _.lowerCase(req.params.postName);
        const postTitle = _.lowerCase(post.title)

        if (requestedTitle === postTitle) {
            res.render("post", {
                postTitle: post.title,
                postContent: post.content
            });
        } else {
            res.render("post", {
                postTitle: "ERROR 404",
                postContent: "The page you are looking for was not found"
            });
        }

    });
});



app.get("/about", (req,res)=>{
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req,res)=>{
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req,res)=>{
    res.render("compose");
});

app.post("/compose", (req,res)=>{

    const post = {
        title: req.body.postTitle,
        content: req.body.postContent
    };
    
    posts.push(post);
    res.redirect('/');
});













app.listen("3000", () => {
    console.log("Server is up and running on port 3000");
});