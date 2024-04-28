import * as dotenv from 'dotenv';
import { errHandler, notFound } from './middlewares/errhandle.js';
import Coins from './models/coin.js';
import PassportRoutes from './routes/passport.routes.js';
import { Server as SocketIo } from 'socket.io';
import User from './models/user.model.js';
import compression from 'compression';
import { connectDb } from './configs/index.js';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import jwt from 'jsonwebtoken';
import middleSwaggers from './docs/index.js';
import morgan from 'morgan';
import passport from 'passport';
import passportMiddleware from './middlewares/passport.middlewares.js';
import path from 'path';
import rootRoutes from './routes/index.js';
import session from 'express-session';
import socket from './configs/socket.js';
import Orders from './models/order.model.js';
import Users from './models/user.model.js';
import fs from 'fs';
import { feedBack } from './controllers/feedback.controller.js';
import cron from 'node-cron';
import Order from './models/order.model.js';
import { portControllers } from './controllers/post.controllers.js';
import Post from './models/post.models.js';
// import Order from './models/order.model.js';
import bodyParser from 'body-parser';
//lấy  jwt

dotenv.config();

/* config */

//Setup dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//file name html
//

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(bodyParser.json());
app.get('/', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');

  const refreshTokenCookie = cookies.refreshToken;
  if (refreshTokenCookie) {
    try {
      const decoded = jwt.verify(refreshTokenCookie, process.env.SECRET_REFRESH);
    } catch (err) {
      console.error('Invalid token:', err.message);
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh Token: ' + refreshTokenCookie);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh Token not found');
  }
});

app.get('/conversations/:id', async (req, res) => {
  try {
    console.log('User:', req.params.id);
    const userId = req.params.id;
    const conversations = await Conversation.find({ members: userId }).populate('members');
    const newData = [];
    for (const result of conversations) {
      const nextResult = result.members.filter((items) => items.id !== userId);
      for (const item of result.members) {
        if (item._id != userId) {
          newData.push({
            account: item.account,
            _id: item._id,
            username: item.username,
            avatar: item.avatar,
          });
        }
      }
    }
    return res.json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/conversations-details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const messages = await Message.find({ conversationId: id }).populate('senderId receiverId');
    return res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.post('/messages-cra', async (req, res) => {
  try {
    console.log(req.body);
    const { senderId, receiverId, content, image } = req.body;
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({ type: 'public', members: [senderId, receiverId] });
    }
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      image,
    });
    return res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/get-user-chat-message', async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(200).json({ message: 'no message' });
    } else {
      return res.status(200).json(conversation);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.use(morgan('common'));
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
    },
  })
);
app.use(helmet());
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  (async () => {
    const user = await User.findById(id).populate([
      { path: 'address', select: '-__v -_id -userId' },
    ]);
    return done(null, user);
  })();
});

/* OAuth2 */
passport.use(passportMiddleware.GoogleAuth);

/* routes */
app.use('/api-docs', middleSwaggers);
app.use('/api', rootRoutes);
app.use('/auth', PassportRoutes);
//
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/voucher.html');
});

app.get('/api/new_voucher', async (req, res) => {
  const { coin, name } = req.query;
  const check = await Coins.findOne({ name });
  if (check) return res.json({ msg: 'Mã đã tồn tại' });
  else {
    await Coins({
      name: name,
      money: coin,
    }).save();
  }
});
app.get('/api/find_voucher', async (req, res) => {
  const { name } = req.query;
  const check = await Coins.findOne({ name });
  if (!check) return res.json({ msg: 'Mã không tồn tại' });
  else {
    return res.json({ msg: `số dư: ${check.money}` });
  }
});
app.get('/api/edit_voucher', async (req, res) => {
  const { name, coin } = req.query;
  const check = await Coins.findOne({ name });
  if (!check) return res.json({ msg: 'Mã không tồn tại' });
  else {
    const lt = check.money * 1 + coin * 1;
    await Coins.updateOne({ _id: check._id }, { $set: { money: lt } });
    return res.json({ msg: `Update thành công số dư: ${lt}` });
  }
});
app.get('/api/cancelOrder/', async (req, res) => {
  const { phoneCheck } = req.query;

  const data = await Orders.find({ status: 'canceled_by_user' });
  var newJson = {};
  for (const value of data) {
    var phone = value.inforOrderShipping.phone;
    if (newJson[phone] == undefined) {
      newJson = { ...newJson, ...{ [phone]: { count: 1 } } };
      if (value.user != undefined && value.user)
        newJson[phone] = { ...newJson[phone], ...{ user: value.user } };
    } else {
      newJson[phone].count = newJson[phone].count + 1;
      if (newJson[phone].user != undefined && newJson[phone].count > 5) {
        const update = await Users.updateOne(
          { _id: newJson[phone].user },
          { $set: { status: 'inactive' } }
        );
      }
    }
  }
  if (phoneCheck) {
    const chc = 5;
    if (newJson[phoneCheck] <= chc) {
      return res.json({ phoneCheck, count: newJson[phoneCheck], status: true });
    } else return res.json({ status: false, msg: 'sdt khong hop le' });
  } else res.json(newJson);
});
app.post('/api/createFeedback/:id', feedBack.createFeedback);
app.get('/api/getAllFeedback', feedBack.getAllFeedBack);
app.get('/api/getidFeedback/:id', feedBack.getIdFeedBack);
app.get('/api/userGetFeedBack', feedBack.userGetFeedBack);
app.post('/api/updateFeedBack/:id', feedBack.updateFeedBack);
app.get('/api/updateUserloyalCustomers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { c } = req.query;
    const data = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          loyalCustomers: c,
        },
      },
      {
        new: true,
      }
    );
    return res.json('success');
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
app.post('/api/post/create-post/:id', async (req, res) => {
  const { data } = req.body;
  const { id } = req.params;
  console.log('1');
  try {
    const newData = await Post.create({
      name: data.name,
      image: data.image,
      location: data.location,
      users: id,
    });
    const nextResult = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          posts: newData._id,
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(nextResult);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.get('/get-status-friend/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { idUser } = req.query;
    const data = await User.findById(id).select('-avatar -coverImage');
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    let newData = '';
    let found = false;
    for (let i = 0; i < data.friends.length; i++) {
      if (data.friends[i].idUser === idUser) {
        found = true;
        if (data.friends[i].status === 1) {
          newData = '1';
        } else {
          newData = '2';
        }
        break;
      }
    }
    if (!found) {
      newData = '3';
    }
    return res.status(200).json({ status: newData });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.post('/send-request-makefriend/:id', async (req, res) => {
  console.log('1');
  try {
    const { id } = req.params;
    const { idUser } = req.query;
    const v1 = await User.findById(id);
    v1.friends.push({
      status: 0,
      idUser: idUser,
    });
    await v1.save();
    return res.json(v1);
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
});
app.post('/approve-makefriend/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { idUser, accept, remove } = req.query;
    if (accept == 1) {
      const accepted = await User.findById(id);
      const newResult = accepted.friends.findIndex((i) => i.idUser == idUser);
      accepted.friends[newResult] = {
        status: 1,
        idUser: accepted.friends[newResult].idUser,
      };

      const acceptedUserMake = await User.findById(idUser);
      acceptedUserMake.friends.push({
        status: 1,
        idUser: id,
      });
      await acceptedUserMake.save();

      await accepted.save();
      return res.json(accepted);
    } else if (remove == 1) {
      const removed = await User.findById(id);
      const indexToRemove = removed.friends.findIndex((friend) => friend.idUser == idUser);
      if (indexToRemove !== -1) {
        removed.friends.splice(indexToRemove, 1);
        await removed.save();
        return res.json(removed);
      } else {
        return res.status(404).json({ message: 'Không tìm thấy phần tử cần xóa trong mảng' });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
//

app.post('/update-corver-image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body.data;
    console.log(req.body);
    const newBanner = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          coverImage: data,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: 'update banner successfully updated',
      newBanner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/update-avatar-image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body.data;
    console.log(req.body);
    const newBanner = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          avatar: data,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: 'update banner successfully updated',
      newBanner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/get-all/friendUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { friend } = req.query;
    const data = await User.findById(id).select('-avatar -coverImage');
    var dataFriendUser = [];
    var dataNoAgred = [];
    for (let i = 0; i <= data.friends.length - 1; i++) {
      if (data.friends.length >= 0 && friend == 0 && data.friends[i].status == 1) {
        dataFriendUser.push(data.friends[i].idUser);
      } else if (data.friends.length >= 0 && friend == 1 && data.friends[i].status == 0) {
        dataNoAgred.push(data.friends[i].idUser);
      }
    }
    var newResult = await User.find({
      _id: { $in: friend == 0 ? dataFriendUser : dataNoAgred },
    });
    return res.status(200).json({ data: newResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// valueDescription
app.post('/update/description-user/:id', async (req, res) => {
  try {
    // description
    const { id } = req.params;
    const dataUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          description: req.body.description,
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(dataUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/get-category-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const myCategory = await CategoryBlog.find({ id_user: id });
    if (!myCategory) {
      return res.status(404).json({
        message: 'No category',
      });
    }
    return res.status(200).json(myCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/get-blogs-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await newBlogModel.find({ id_user: id });
    if (!data) {
      return res.status(404).json({
        message: 'No category',
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
app.post('/api/update-product-v5/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const values = req.body;
    const data = await Product.findById(id);
    if (!data) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }
    data.name = values.name;
    data.description = values.description;
    data.images = values.images;
    data.sale = values.sale;
    data.is_active = values.is_active;
    await data.save();
    return res.status(200).json({
      message: 'ok',
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/api/get-product-user-create/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Product.find({ idUser: id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get('/api/add-sp-yt/:id', async (req, res) => {
  try {
    const { idPro } = req.query;
    const data = await User.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          ytProduct: idPro,
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/api/remove-sp-yt/:id', async (req, res) => {
  try {
    const { idPro } = req.query;
    const data = await User.findById(req.params.id);
    data.ytProduct = data.ytProduct.filter((x) => x != idPro);
    await data.save();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get('/api/get-product-farvourite/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dataUser = await User.findById(id).select('ytProduct').populate('ytProduct');
    return res.status(200).json(dataUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get('/api/check-product-farvourite/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { idPro } = req.query;
    const dataUser = await User.findById(id);
    const indexPro = dataUser.ytProduct.findIndex((item) => item == idPro);
    return res.status(200).json({
      data: indexPro == -1 ? false : true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.use(errHandler);

/* connectDb */
connectDb();

/* listen */
const port = process.env.PORT || 5000;

//Chat
let server;

// if (process.env.NODE_ENV === 'production') {
// Sử dụng HTTPS trong production
// const options = {
// key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
// cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
// };
// server = https.createServer(options, app);
// } else {
// Sử dụng HTTP trong development
server = http.createServer(app);
// }

// const server = http.createServer(app);
const io = new SocketIo(server);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
server.listen(port, async () => {
  try {
    socket(io);
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
import mongoose from 'mongoose';
import { CategoryBlog } from './models/category-blog.model.js';
import newBlogModel from './models/newsBlogs.model.js';
import Product from './models/product.model.js';
const { Schema } = mongoose;
// Định nghĩa schema cho các collection
const conversationSchema = new Schema({
  type: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message2', messageSchema);
async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
async function createConversation(type, members) {
  try {
    console.log(type, members, 'type, members');
    const conversation = await Conversation.create({ type, members });
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}
async function sendMessage(conversationId, senderId, content) {
  try {
    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

const userId = '6527baf2654b2fa462bd84e8';
// getUserById(userId)
//   .then((user) => {
//     console.log('User:', user);
//     const newObjectId = new mongoose.Types.ObjectId(userId);
//     console.log('newObjectId:', newObjectId);
//     return createConversation('private', newObjectId);
//   })
//   .then((conversation) => {
//     console.log('Conversation:', conversation);
//     return sendMessage(conversation._id, userId, 'Hello!');
//   })
//   .then((message) => {
//     console.log('Message sent:', message);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
