const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {User,Thing,syncAndSeed,conn} = require('./db');

app.use('/public', express.static('public'));
app.use(require('method-override')('_method'));
app.use(express.urlencoded({extended:false}));
app.use((err,req,res,next) => {
    console.log(err);
})
app.use('/things',require('./routers/things'));


app.get("/", async(req,res,next) => {
    res.redirect('/things');
});

app.listen(port, async() => {
    try{
        console.log(`listening at port ${port}`)
        syncAndSeed();
    }
    catch(ex){
        next(ex);
    }
})