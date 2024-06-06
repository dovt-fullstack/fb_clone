import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  yearold: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  workplace: {
    type: String,
    required: true,
  },
  geoLocation: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  default: {
    type: Boolean,
    default: false,
  },
});

addressSchema.plugin(mongoosePaginate);

const Address = mongoose.model('Address', addressSchema);

export default Address;
