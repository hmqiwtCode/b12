const express = require('express')
const uuid = require('uuid')
const multer = require('multer')
const hbs = require('hbs')
const {AWS,docClient,tableName,dynamodb} = require('./crud')
const path = require('path')

const port = process.env.PORT || 3001
const viewPath = path.join(__dirname,'./template')
const publicPath = path.join(__dirname,'./public')

const app = express()

app.set('view engine','hbs')
app.set('views',viewPath)
app.use(express.static(publicPath))
app.use(express.json())

const s3 = new AWS.S3({
    accessKeyId : "",
    secretAccessKey : ""
})

const storage = multer.memoryStorage()
const upload = multer({storage}).single('image')



app.get('/home', async(req,resp) => {
    const param = {
        TableName : tableName
    }
    const results = []
    const item = await docClient.scan(param).promise()
    do{
        item.Items.forEach(sv => {
            results.push(sv)
        })
    }while(typeof item.LastEvaluatedKey !== 'undefined')
    resp.render('home',{
        results
    })
})

app.post('/sinhvien',upload, async(req,resp) => {
    let linkLocation = 'https://uifaces.co/our-content/donated/gPZwCbdS.jpg'
    if(req.file){
        const ext = req.file.originalname.split('.')[1]
        const param = {
            Bucket : "dungxoa",
            Key : `${uuid.v4()}.${ext}`,
            Body : req.file.buffer,
            ACL : 'public-read'
        }
        const data = await s3.upload(param).promise()
        if(data.Location){
            linkLocation = data.Location
        }
    }
    const pr = {
        TableName : tableName,
        Item : {
            ...req.body,
            avatar : linkLocation
        }
    }

    docClient.put(pr,(e,d) => {
        if(e){
            return resp.status(500).send(e)
        }
        return resp.status(200).send({...req.body,avatar: linkLocation})
    })
})


app.delete('/sinhvien/:id',(req,resp) => {
    const id = req.params.id
    const param = {
        TableName : tableName,
        Key : {
            mssv : id
        }
    }

    docClient.delete(param,(e,d) => {
        if(e){
            return resp.status(500).send(e)
        }
        return resp.status(200).send({"success" : "true"})
    })
})


app.get('/sinhvien/:id',(req,resp) => {
    const pr = {
        TableName : tableName,
        Key : {
            mssv : req.params.id
        }
    }

    docClient.get(pr,(e,d) => {
        if(e){
            return resp.status(500).send(e)
        }
        return resp.status(200).send(d.Item)
    })
})


app.patch('/sinhvien/:id',upload,async (req,resp) => {
    let linkLocation = null
    let pr = null
    if(req.file){
        const ext = req.file.originalname.split('.')[1]
        const param = {
            Bucket : "dungxoa",
            Key : `${uuid.v4()}.${ext}`,
            Body : req.file.buffer,
            ACL : 'public-read'
        }
        const data = await s3.upload(param).promise()
        if(data.Location){
            linkLocation = data.Location
        }
    }

    if(linkLocation){
        pr = {
            TableName : tableName,
            Key : {
                mssv : req.params.id
            },
            UpdateExpression: "set ho = :ho, ten=:ten, lop=:lop, avatar =:ava",
            ExpressionAttributeValues:{
                ":ho":req.body.ho,
                ":ten":req.body.ten,
                ":lop": req.body.lop,
                ":ava" : linkLocation
            },
            ReturnValues:"UPDATED_NEW"
        }
    }else{
        pr = {
            TableName : tableName,
            Key : {
                mssv : req.params.id
            },
            UpdateExpression: "set ho = :ho, ten=:ten, lop=:lop",
            ExpressionAttributeValues:{
                ":ho":req.body.ho,
                ":ten":req.body.ten,
                ":lop": req.body.lop
            },
            ReturnValues:"UPDATED_NEW"
        }
    }

    docClient.update(pr,(e,d) => {
        if(e){
            console.log(e)
            return resp.status(500).send(e)
        }
        return resp.status(200).send({...req.body})
    })
})


app.listen(port,()=> {
    console.log(`Listen at port ${port}`)
})
