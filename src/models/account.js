const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const { generateToken } = require('./lib/token');

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}

const Account = new Schema({
    userid: String,
    password: String,
    describe: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

Account.statics.findByUserid = function(userid) {
    return this.findOne({ userid: userid }).exec();
};

Account.statics.register = function({ userid, password, describe }) {
    const account = new this({
        userid,
        password: hash(password),
        describe
    });

    return account.save();
};

Account.methods.validatePassword = function(password) {
    const hashed = hash(password);
    return this.password === hashed;
};

Account.methods.generateToken = function() {
    // JWT 에 담을 내용
    const payload = {
        _id: this._id,
        userid: this.userid,
        describe: this.describe
    };

    return generateToken(payload, 'account');
};

module.exports = mongoose.model('Account', Account);