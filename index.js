const express = require("express");
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

//CORS란 자신이 속하지 않은 다른 도메인, 다른 프로토콜, 혹은 다른 포트에 있는 리소스를 요청하는 cross-origin HTTP 요청 방식이다
let corsOption = {
    origin: "*",
    credential: true
}
app.use(cors(corsOption));

//POST request data의 body로부터 파라미터를 편리하게 추출합니다.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// 이미지를 업로드 하는 multer 
const multer  = require('multer')
let upload = multer({
    storage: multer.diskStorage({ // 어디에 저장할 것인가? 일단 하드디스크
    destination:function(req,file,cd){
        cd(null,"/uploads");
    },
    filename:function(req,file,cd){
        const ext = path.extname(file.originalname); //확장자 추출
        const basename = path.basename(file.originalname,ext);//파일이름
        cd(null,basename +"_"+new Date().getTime() + ext);//파일이름+시간초+확장자  => 나중에는 아이디 값도
    }
}),limits:{
    fileSize: 0.3*1024*1024
}, // 용량제한 300KB
})

//받아 올 수 있는 값 제한을 3mb로 늘려줌
app.use(express.json({
    limit: '3mb'
}))
app.use(express.urlencoded({
    limit: '3mb',
    extended: false
}))

//이미지를 볼 수 있게 경로 설정
//app.use('/uploads', express.static('uploads'));
//파일 업로드시 실행되는 함수
app.post("/upload",upload.single('imgFile'),(req, res) => {
    console.log(
        req.body
    )
    res.send('확인');
})

app.get("/", (req, res) => {
    res.send('하하하하')
})

app.listen(port, () => {
    console.log("서버 실행됨" + port);
})