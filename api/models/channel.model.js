// backend/models/channel.model.js
import mongoose from 'mongoose';


const channelSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
      },
      type: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        default: '',
      },
      tags: [String],
      channelImage: { 
        type: String ,
        required: true,
      },
    },
    
    { timestamps: true }
  );

// module.exports = mongoose.model('Channel',channelSchema);

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;