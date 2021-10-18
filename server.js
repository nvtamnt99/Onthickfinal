require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const multer = require('multer');
const port = 3000;

app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({
    extended: true
}));

const convertFromJson = multer();

AWS.config.update({
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
});

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'paper';

app.get('/', (req, res) => {
    const params = {
        TableName: tableName
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            return  res.render('index', {data: data.Items});
        }
    })
   
});

app.post('/',convertFromJson.fields([]), (req, res) => {
    const {id, tenBaiBao, tenNhomTacGia, isbn, soTrang, namxb} = req.body;
    const params = {
        TableName: tableName, 
        Item: {
            id, tenBaiBao, tenNhomTacGia, isbn, soTrang, namxb
        }
    };

    docClient.put(params, (err, data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            return  res.redirect('/');
        }
    })
   
});

app.post('/',convertFromJson.fields([]), (req, res) => {
    const {id, tenBaiBao, tenNhomTacGia, isbn, soTrang, namxb} = req.body;
    const params = {
        TableName: tableName, 
        Key: {
            id
        },
        UpdateExpression: "set tenBaiBao=:tenBaiBao,tenNhomTacGia=:tenNhomTacGia, isbn=:isbn,soTrang=:soTrang, namxb=:namxb",
        ExpressionAttributeValues:{
            ":tenBaiBao": tenBaiBao,
            ":tenNhomTacGia": tenNhomTacGia,
            ":isbn": isbn,
            ":soTrang": soTrang,
            ":namxb": namxb,
        },
        ReturnValues: "UPDATE_NEW"
    };

    docClient.update(params, (err, data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            return  res.redirect('/');
        }
    })
   
});

app.post('/delete',convertFromJson.fields([]), (req, res) => {
    const {id} = req.body;
    const params = {
        TableName: tableName, 
        Key: {
            id
        }
    };

    docClient.delete(params, (err, data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            return  res.redirect('/');
        }
    })
   
});

app.listen(port, () => {
    console.log('Server running on port: ', `${port}`);
});


