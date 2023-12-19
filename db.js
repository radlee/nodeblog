const  mongoose = require('mongoose');

const db = (async () => {
   try {
    await mongoose.connect('mongodb+srv://radlee:Leander247365@blogger.p3sz3ls.mongodb.net/blogger', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('Database Successfully connected');
   } catch (error) {
    console.log(error)
   }
})();

module.exports = db;
