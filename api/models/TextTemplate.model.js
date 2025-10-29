// ### backend/models/TextTemplate.model.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const LayerSchema = new Schema({
  id: String,
  type: { type: String, enum: ['background', 'text'], default: 'text' },
  text: String,
  fontSize: Number,
  fontFamily: String,
  fontWeight: Number,
  color: String,
  palette: [String],
  effect: String,
  x: Number,
  y: Number,
  zIndex: Number,
  width: Number,
  height: Number,
  url: String,
  opacity: Number,
  blur: Number,
  clipPath: String,
  maskSettings: Object,
  playback: Object
}, { _id: false });

const TextTemplateSchema = new Schema({
  name: { type: String, default: 'Untitled' },
  text: { type: String, default: 'Hello world' },
  effect: { type: String, default: 'animatedGradient' },
  fontSize: { type: Number, default: 72 },
  color: { type: String, default: '#ff7a18' },
  palette: { type: [String], default: ['#ff7a18', '#ffd200'] },
  pos: {
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 }
  },
  bgImageUrl: { type: String, default: '' },
  blur: { type: Number, default: 0 },
  zIndex: { type: Number, default: 2 },
  opacity: { type: Number, default: 1 },
  layers: [LayerSchema], // ✅ new field for layer-based templates
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TextTemplate', TextTemplateSchema);

