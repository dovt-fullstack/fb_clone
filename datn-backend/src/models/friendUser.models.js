// import mongoose from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';

// const friendSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     products: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//       },
//     ],
//     is_deleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true, versionKey: false }
// );

// friendSchema.plugin(mongoosePaginate);

// const Friends = mongoose.model('Friends', friendSchema);

// export default Friends;
