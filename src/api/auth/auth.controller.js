const Account = require('models/account');

// register
exports.register = async (ctx) => {
    const { user } = ctx.request; // 로그인 검증
    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    const { userid } = ctx.request.body;

    let existing = null;
    try {
        existing = await Account.findByUserid(userid);
    } catch (e) {
        ctx.throw(500, e);
    }

    if(existing) {
    // 중복되는 아이디가 있을 경우
        ctx.status = 409;
        ctx.body = { message: 'the userid is already existing' };
        return;
    }
    
    let account = null;
    try {
        account = await Account.register(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }

    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }
    ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
    
    ctx.body = { message: 'Succesfully created an account: ' + account.userid };
};

// login
exports.login = async (ctx) => {
    const { userid, password } = ctx.request.body; 

    let account = null;
    try {
        // 계정 찾기
        account = await Account.findByUserid(userid);
    } catch (e) {
        ctx.throw(500, e);
    }

    if(!account || !account.validatePassword(password)) {
    // 유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
        ctx.status = 403; // Forbidden
        return;
    }

    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }
    ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

    ctx.body = { message: 'Succesfully signed in to an account: ' + account.userid };
};

// logout
exports.logout = async (ctx) => {
    ctx.cookies.set('access_token', null, {
        maxAge: 0, 
        httpOnly: true
    });
    ctx.status = 204;
};

// 쿠키에 토큰이 있어 자동으로 디코딩된 정보를 보내줌
exports.getUserInfo = (ctx) => {
    const { user } = ctx.request; // 로그인 검증
    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    ctx.body = user;
};