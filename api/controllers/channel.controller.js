// controllers/channel.controller.js
import Channel from '../models/channel.model.js';
import slugify from 'slugify';

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { name, type, description, tags, channelImage } = req.body;

    if (!name || !channelImage) {
      return res.status(400).json({ message: 'Name and channelImage are required' });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingChannel = await Channel.findOne({ slug });
    if (existingChannel) {
      return res.status(400).json({ message: 'Channel with this name already exists' });
    }

    const newChannel = new Channel({
      name,
      slug,
      type,
      description,
      tags,
      channelImage,
    });

    const savedChannel = await newChannel.save();
    res.status(201).json(savedChannel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all channels
export const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: -1 });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single channel by ID or slug
export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id) || await Channel.findOne({ slug: id });

    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a channel
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, tags, channelImage } = req.body;

    const updatedData = {
      name,
      type,
      description,
      tags,
      channelImage,
    };

    if (name) updatedData.slug = slugify(name, { lower: true, strict: true });

    const updatedChannel = await Channel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedChannel) return res.status(404).json({ message: 'Channel not found' });

    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a channel
export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChannel = await Channel.findByIdAndDelete(id);

    if (!deletedChannel) return res.status(404).json({ message: 'Channel not found' });

    res.status(200).json({ message: 'Channel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
