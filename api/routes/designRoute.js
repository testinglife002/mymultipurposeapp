// backend/routes/designRoute.js
import express from "express";
import DesignController from "../controllers/designController.js";

const router = express.Router();

router.post("/create-user-design", DesignController.create_user_design);
router.get("/user-design/:designId", DesignController.get_user_design);
router.put("/update-user-design/:designId", DesignController.update_user_design);

router.post("/add-user-image", DesignController.add_user_image);
router.get("/get-user-image", DesignController.get_user_image);

router.get("/design-images", DesignController.get_initial_image);
router.get("/background-images", DesignController.get_background_image);

router.get("/user-designs", DesignController.get_user_designs);

router.delete("/delete-user-image/:designId", DesignController.delete_user_image);

router.get("/templates", DesignController.get_templates);

router.get("/add-user-template/:templateId", DesignController.add_user_template);

router.post("/add-design-image", DesignController.add_design_image);

router.post("/add-background-image", DesignController.add_background_image);


export default router;
