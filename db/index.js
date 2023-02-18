const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_users_things_db');

const User = conn.define('user', {
    name:{
        type:Sequelize.STRING
    }
});

const Thing = conn.define('thing', {
    name:{
        type:Sequelize.STRING
    }
})

Thing.belongsTo(User);

const syncAndSeed = async() => {
    await conn.sync({force:true});

    const [moe,larry,lucy] = await Promise.all([
        User.create({name:'Moe'}),
        User.create({name:'Larry'}),
        User.create({name:'Lucy'})
    ])

    await Promise.all([
        Thing.create({name:'foe',userId:lucy.id}),
        Thing.create({name:'bar',userId:larry.id}),
        Thing.create({name:'foe'})
    ])
}

module.exports = {
    User,
    Thing,
    syncAndSeed,
    conn
}