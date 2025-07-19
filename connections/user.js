const mongoose = require('mongoose');
async function connect(url) {
  try {
    await mongoose.connect(url);
    console.log('Mongoose connected')
  } catch (err) {
    console.log('Error found: ', err);
  }
}
module.exports={connect};