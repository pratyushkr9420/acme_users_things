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
app.post('/things',async(req,res,next) => {
    try{
        if (req.body.userId === ''){
            req.body.userId = null;
        }
        const thing = await Thing.create(req.body);
        res.redirect(`/things/${thing.id}`);
    }
    catch(ex){
        next(ex);
    }
});


app.delete('/things/:id',async(req,res,next) => {
    const thing = await Thing.findByPk(req.params.id);
    thing.destroy()
    res.redirect('/');
})

app.get("/", async(req,res,next) => {
    res.redirect('/things');
})
app.get('/things', async(req,res,next) => {
    try{
        const things = await Thing.findAll({
            include: [ User ]
          });
          res.send(`
          <html>
           <head>
             <link rel='stylesheet' href='/public/design.css'/>
           </head>
           <body>
            <h1>Acme users and Things</h1>
            <a href='/things/add'>Add</a>
            ${
                things.map(thing => {
                    return `<li><a href='/things/${thing.id}'>${thing.name}</a> owned by ${thing.user ? thing.user.name : 'nobody'}</li>`
                }).join(" ")
            }
           </body>
          </html>
          `)
    }
    catch(ex){
        next(ex);
    }
});

app.get('/things/add', async(req, res, next)=> {
    try {
      const users = await User.findAll();
      res.send(`
      <html>
        <head>
          <title>Acme User Things SEQ</title>
          <link rel='stylesheet' href='/public/design.css' />
        </head>
        <body>
          <h1>Acme User Things SEQ</h1>
          <a href='/things'>Back</a>
          <form method='POST' action='/things'>
           <input name='name' />
           <select name='userId'>
            <option value=''>--select a user--</option>
            ${
                users.map(user => {
                    return `<option value='${user.id}'>${user.name}</option>`
                }).join(" ")
            }
           </select>
           <button>Create</button>
          </form>
        </body>
      </html>
      `);
    }
    catch(ex){
      next(ex);
    }
});

app.get('/things/:id', async(req,res,next) => {
    try{
        const thing = await Thing.findByPk(req.params.id,{
            include: [ User ]
          });
          res.send(`
          <html>
           <head>
             <link rel='stylesheet' href='/public/design.css'/>
           </head>
           <body>
            <h1>Acme users and Things</h1>
            <a href='/things'>Back</a>
            <h2>${thing.name}</h2>
            <div id = 'container'>
             <p>owned by ${thing.user ? thing.user.name:"nobody"}</p>
             <form method='POST' action='/things/${thing.id}?_method=delete'>
              <button>X</button>
             </form>
            </div>
           </body>
          </html>
          `)
    }
    catch(ex){
        next(ex);
    }

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