const express = require("express");
const fs = require('fs');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 3001;
//CORS란 자신이 속하지 않은 다른 도메인, 다른 프로토콜, 혹은 다른 포트에 있는 리소스를 요청하는 cross-origin HTTP 요청 방식이다
let corsOption = {
    origin: "*",
    credential: true
}
app.use(cors(corsOption));

//POST request data의 body로부터 파라미터를 편리하게 추출합니다.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//이미지파일처리를 위해서 라이브러리 추가 해야함

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const multer = require('multer');
//const upload = multer({dest: './upload'})

const multipart = require('connect-multiparty');
app.use(multipart()); //formdata를 파싱해줌

let upload = multer({
    storage: multer.diskStorage({ // 어디에 저장할 것인가? 일단 하드디스크
    destination:function(req,file,cd){
        cd(null,"./uploads");
    },
    filename:function(req,file,cd){
        const ext = path.extname(file.originalname); //확장자 추출
        const basename = path.basename(file.originalname,ext);//파일이름
        cd(null,basename +"_"+new Date().getTime() + ext);//파일이름+시간초+확장자
    }
}),limits:{
    fileSize: 0.3*1024*1024
}, // 용량제한 300KB


})
//upload.single('file'),



/* let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

let upload = multer({ storage: storage }); */
app.post("/upload", upload('imgFile'), (req, res) => {

    res.send('확인');
    console.log(req.body);
})
app.get("/", (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
    console.log("서버 실행됨" + port);
})