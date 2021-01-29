const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser")
const { User } = require("./models/User")
const cookieParser = require("cookie-parser")
const config = require("./config/key");
const { auth } = require("./middleware/auth")

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

//application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Conneted..')).catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요!!!!')
})


//register router
app.post('/api/users/register', (req, res) => {
    //회원 가입할때 필요한 정보를 client에서 가져오면
    //그것들을 데이터 베이스에 저장한다.
    const user = new User(req.body);
    console.log(user);
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

//login router
app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터 베이스에서 있는지 찾는다.
    //findOne 몽고DB내장함수, (찾는거, 콜백함수(err에러, user->찾은정보))
    User.findOne({ email: req.body.email }, (err, user) => {
        //user 값이 없다면 아래껄 리턴함
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 일치하는지 확인한다.
        //찾은 유저 데이터를 비교함, 해당 메서드를 User.js에 만듬 (요청비번, 콜백함수)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            //비밀번호가 같다면 Token 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).senr(err);

                // 토큰을 저장한다. 어디에 ?  쿠키? 로컬스토리지? 세션?
                res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


//auth는 미들웨어 콜백펑션 전에 뭔갈 해주는 거
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다 = Authentification 이 True
    res.status(200).json({
        _id: req.ruser._id,
        isAdmin: req.user.role === 0 ? false : ture,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


//Logout
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ succss: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})