// backend/controllers/designController.js
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import Design from '../models/designModel.js';
import UserImage from '../models/userImageModel.js';
import BackgroundImage from '../models/backgroundImageModel.js';
import DesignImage from '../models/designImageModel.js';

import mongoose from "mongoose";
import Template from '../models/templateModel.js';
const { ObjectId } = mongoose.Types;

// const { ObjectId } = mongoose.mongo;


/* 
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET',
  secure: true // Optional: to ensure HTTPS URLs
});
*/


class DesignController {

  create_user_design = async (req, res) => {
    // console.log("ok");
    const form = formidable({});
    // const {_id} = req.userInfo;

    try {

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true // Optional: to ensure HTTPS URLs
        });

        // with Promise
        const [fields, files] = await form.parse(req);
        // console.log(files);
        // console.log(fields);
        // console.log(fields.design[0]);
    
        const {image} = files;
        
         const {url} = await cloudinary.uploader.upload(image[0].filepath)
        const design = await Design.create({
            user_id: null,
            components: [JSON.parse(fields.design[0])],
            image_url: url
        }) 
        
        return res.status(200).json({design})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
    
    // res.send("User design created");
  };

  get_user_design = async (req,res) => {
   const {designId} = req.params
   // console.log(designId) 

   try {
      const design = await Design.findById(designId)
      return res.status(200).json({ design: design.components })
   } catch (error) {
      return res.status(500).json({message: error.message})
   }
  }
  
  update_user_design = async (req,res) => {
    const {designId} = req.params
    const form = formidable({});
    try {
      cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true // Optional: to ensure HTTPS URLs
      });

        // with Promise
      const [fields, files] = await form.parse(req);
      const {image} = files;
      // console.log(fields);
      const components = JSON.parse(fields.design[0]).design
      const old_design  = await Design.findById(designId)
      if(old_design){
        if(old_design.image_url){
          const splitImage = old_design.image_url.split('/')
          const imageFile = splitImage[splitImage.length - 1]
          const imageName = imageFile.split('.')[0]
          await cloudinary.uploader.destroy(imageName)
        }
        const {url} = await cloudinary.uploader.upload(image[0].filepath)
        await Design.findByIdAndUpdate(designId, {
          image_url: url,
          components
        })
        return res.status(200).json({ message: 'image saved successfully' })
      }else {
        return res.status(404).json({ message: 'design not found' })
      }
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({message: error.message})
    }
  }

  add_user_image = async (req,res) => {
    const form = formidable({});
    const {_id} = '123'
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true // Optional: to ensure HTTPS URLs
    });
    try {
      const [fields, files] = await form.parse(req);
      const {image} = files;
      // console.log(fields);
      const {url} = await cloudinary.uploader.upload(image[0].filepath)
      const userImage = await UserImage.create({
        user_id: _id,
        image_url: url
      })
      return res.status(200).json({userImage})
    } catch (error) {
      // console.log(error)
      return res.status(500).json({message: error.message})
    }
      
  }

  get_user_image = async (req,res) => {
    // const {_id} = req.userInfo;
    const {_id} = '123'
    try {
      // const images =  await UserImage.find({user_id: new ObjectId(_id)})
      const images =  await UserImage.find({})
      return res.status(200).json({images})
    } catch (error) {
      // console.log(error)
      return res.status(500).json({message: error.message})
    }
  }

  get_initial_image = async (req,res) => {
    try {
      const images =  await DesignImage.find({})
      return res.status(200).json({images})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }

  get_background_image = async (req,res) => {
    try {
      const images =  await BackgroundImage.find({})
      return res.status(200).json({images})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }



  get_user_designs = async (req, res) => {
    try {
      // Hardcoded user ID for testing
      const userId = "68a7ddab3f525c53b821bea5";

      const designs = await Design.find({ user_id: new ObjectId(userId) }).sort({createdAt:-1});
      return res.status(200).json({ designs });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  delete_user_image = async (req,res) => {
    const {designId} = req.params;
    try {
      await Design.findByIdAndDelete(designId)
      return res.status(200).json({ message: 'design deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  get_templates = async (req,res) => {
    try {
      const templates = await Template.find({ }).sort({createdAt:-1});
      return res.status(200).json({ templates });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  add_user_template = async (req,res) => {
    const {templateId} = req.params;
    // Hardcoded user ID for testing
      const userId = "68a7ddab3f525c53b821bea5";
    try {
      const template = await Template.findById(templateId).sort({createdAt:-1});
      const design = await Design.create({
            user_id: userId,
            components: template.components,
            image_url: template.image_url
      }) 
      return res.status(200).json({ design });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // --- ADD BELOW EXISTING IMPORTS AND OTHER FUNCTIONS --- //

  add_design_image = async (req, res) => {
    const form = formidable({});
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    try {
      const [fields, files] = await form.parse(req);
      const { image } = files;

      if (!image || !image[0]) {
        return res.status(400).json({ message: "No design image uploaded" });
      }

      const { url } = await cloudinary.uploader.upload(image[0].filepath);
      const newDesignImage = await DesignImage.create({ image_url: url });

      return res.status(200).json({ image: newDesignImage });
    } catch (error) {
      console.error("Error uploading design image:", error.message);
      return res.status(500).json({ message: error.message });
    }
  };

  add_background_image = async (req, res) => {
    const form = formidable({});
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    try {
      const [fields, files] = await form.parse(req);
      const { image } = files;

      if (!image || !image[0]) {
        return res.status(400).json({ message: "No background image uploaded" });
      }

      const { url } = await cloudinary.uploader.upload(image[0].filepath);
      const newBgImage = await BackgroundImage.create({ image_url: url });

      return res.status(200).json({ image: newBgImage });
    } catch (error) {
      console.error("Error uploading background image:", error.message);
      return res.status(500).json({ message: error.message });
    }
  };

  
}

export default new DesignController();
