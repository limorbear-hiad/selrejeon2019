const Post = require('/models/posts');

exports.list = async (ctx) => { // 추천평 리스트 조회
    const { page } = ctx.params; // 몇번째 페이지인지 받아온다.
    const numberOfPostsPerAPage = 5;
    
    let posts; // 데이터가 들어갈 변수를 미리 만든다.

    try {
        // 데이터 조회
        posts = await Post.find()
                .sort({_id: -1 }) // _id 기준 역순으로 정렬 (최근이 앞으로)
                .skip(numberOfPostsPerAPage * (page-1))
                .limit(numberOfPostsPerAPage) // 갯수 제한
                .exec(); // 반환값은 프로미스이므로 await 사용 가능
    } catch(e) {
        return ctx.throw(500, e);
    }

    ctx.body = posts;
};

exports.listOfPostOfAnArtist = async (ctx) => {
    const { artist, page } = ctx.params;
    const numberOfPostsPerAPage = 5;

    let posts; // 데이터가 들어갈 변수를 미리 만든다.

    try {
        // 데이터 조회
        posts = await Post.find({ targetArtist: artist })
                .sort({_id: -1 }) // _id 기준 역순으로 정렬 (최근이 앞으로)
                .skip(numberOfPostsPerAPage * (page-1))
                .limit(numberOfPostsPerAPage) // 갯수 제한
                .exec(); // 반환값은 프로미스이므로 await 사용 가능
    } catch(e) {
        return ctx.throw(500, e);
    }

    ctx.body = posts;
}

exports.create = async (ctx) => { // 추천평 작성
    const { user } = ctx.request; // 로그인 검증
    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    const {
        author,
        date,
        targetArtist,
        targetWork,
        content
    } = ctx.request.body;

    const post = new Post({ // post 인스턴스를 만든다
        author,
        date,
        targetArtist,
        targetWork,
        content
    });

    try {
        await post.save();
    } catch(e) {
        return ctx.throw(500, e);
    }

    ctx.body = post;
};

exports.update = async (ctx) => { // 전송되는 값을 수정; 예컨대 추천평 비공개 설정
    const { user } = ctx.request; // 로그인 검증
    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    const { id } = ctx.params;

    let post;
    
    try {
        post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true
        });
    } catch(e) {
        return ctx.throw(500, e);
    }

    ctx.body = post;
};

exports.listOfArtists = async (ctx) => {
    let data; // 데이터가 들어갈 변수를 미리 만든다.

    try {
        // 데이터 조회
        // data = await Post.find({}, { "author": false, "date": false, "hide": false, "targetArtist": true, "targetWork": false, "content": false })
        data = await Post.find({}, { 'targetArtist': true })
                .exec(); // 반환값은 프로미스이므로 await 사용 가능
    } catch(e) {
        return ctx.throw(500, e);
    }

    const tmp = [];
    data.forEach((element) => {
        tmp.push(element.targetArtist); // 임시 배열에 모든 작가 이름을 넣는다
    });
    const artists = [...new Set(tmp)]; // Unique 값만 취하는 Set을 이용해 중복을 제거한다
    ctx.body = artists;
}