// Main.jsx 
// Main.jsx 
import React, { useEffect, useState } from "react";
import HeaderAlt from "./HeaderAlt";
import { BsFillImageFill, BsFolder, BsGrid1X2 } from "react-icons/bs";
import { FaCloudUploadAlt, FaShapes } from "react-icons/fa";
import { TfiText } from "react-icons/tfi";
import { RxTransparencyGrid } from "react-icons/rx";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import TemplateDesignAlt from "./TemplateDesignAlt";
import MyImagesAlt from "./MyImagesAlt";
import ProjectsAlt from "./ProjectsAlt";
import CreateComponentAlt from "./CreateComponentAlt";
import InitialImage from "./InitialImage";
import BackgroundImage from "./BackgroundImage";
import newRequest from "../../api/newRequest";
import { useParams } from "react-router-dom";
 import "./Main.css";
 import LayersPanel from "./LayersPanel";



const Main = () => {
 const {designId} = useParams();

  const [state, setState] = useState('');
  // const [currentComponent, setCurrentComponent] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState('');
  const [rotate, setRotate] = useState(0);
  const [left, setLeft] = useState('');
  const [top, setTop] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [opacity, setOpacity] = useState('');
  const [weight, setWeight] = useState('');
  const [padding, setPadding] = useState('');
  const [font, setFont] = useState('');
  const [zIndex, setZIndex] = useState('');
  const [text, setText] = useState('');
  const [radius, setRadius] = useState(0);

  const [bgColor, setBgColor] = useState('#ffffff');
  const [textBgColor, setTextBgColor] = useState('#ffffff');


  // sensitivity scales (used by handlers)
  const [moveScale, setMoveScale] = useState(1);
  const [resizeScale, setResizeScale] = useState(1);
  const [rotateScale, setRotateScale] = useState(1);

  const [designImages, setDesignImages] = useState([]);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);


  const [show,setShow] = useState({
      status: true,
      name: ''
  })

  // --- Panel States ---
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const toggleLeftPanel = () => setLeftPanelOpen(!leftPanelOpen);
  const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);
  // const [state, setState] = useState("");

  const [showLayersPanel, setShowLayersPanel] = useState(false);

  const toggleLayersPanel = () => setShowLayersPanel(!showLayersPanel);


  const [currentComponent, setCurrentComponent] = useState(null);

  /*
  const [components, setComponents] = useState([
    {
      id: Date.now(),
      name: "main_frame",
      type: "rect",
      width: 650,
      height: 480,
      z_index: 1,
      color: "#fff",
      image: "",
      moveElement: () => {},
      resizeElement: () => {},
      rotateElement: () => {},
      setCurrectComponent: () => {},
    },
  ]);
  */
  // canvas components
  const [components, setComponents] = useState([
    {
      id: Date.now(),
      name: "main_frame",
      type: "rect",
      width: 650,
      height: 480,
      z_index: 1,
      color: "#fff",
      image: "",
      left: 0,
      top: 0,
      rotate: 0,
      opacity: 1,
    },
  ]);

  // change active menu + state
  const setElements = (type, name) => {
    setState(type);
    setActiveMenu(name);
    // keep panels open when selecting
    setLeftPanelOpen(true);
    // setRightPanelOpen(true); // comment/uncomment depending desired behavior
  };

  

  const menuItems = [
    { icon: <BsGrid1X2 />, name: 'design', label: 'Design' },
    { icon: <FaShapes />, name: 'shape', label: 'Shapes' },
    { icon: <FaCloudUploadAlt />, name: 'uploadImage', label: 'Upload' },
    { icon: <TfiText />, name: 'text', label: 'Text' },
    { icon: <BsFolder />, name: 'projects', label: 'Projects' },
    { icon: <BsFillImageFill />, name: 'images', label: 'Images' },
    { icon: <RxTransparencyGrid />, name: 'background', label: 'Background' },
  ];

   // Helper to write component state (keeps immutability)
  // immutably update a component by id
  const setComponentProp = (id, patch) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
    setCurrentComponent((cur) =>
      cur && cur.id === id ? { ...cur, ...patch } : cur
    );
  };

  const onRangeChange = (prop, value) => {
    if (!currentComponent) return;
    const numeric = Number(value);
    setComponentProp(currentComponent.id, { [prop]: numeric });
  };



  // ---------------------------
  // Handlers: move / resize / rotate
  // ---------------------------

  // MOVE: elementId is "elem-{info.id}"
  const moveElement = (elementId, info, e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(elementId);
    if (!el) return;

    // record starting positions
    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = info.left ?? rect.left;
    const startTop = info.top ?? rect.top;

    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    const onMouseMove = (ev) => {
      const rawX = ev.clientX - offsetX;
      const rawY = ev.clientY - offsetY;
      // compute delta from starting stored left/top
      const dx = rawX - (startLeft || 0);
      const dy = rawY - (startTop || 0);
      const newLeft = Math.round((startLeft || 0) + dx * moveScale);
      const newTop = Math.round((startTop || 0) + dy * moveScale);
      // apply to DOM for immediate feedback
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
      // update state
      setComponentProp(info.id, { left: newLeft, top: newTop });
    };

    const stop = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
  };

  // RESIZE: handle describes which corner ("tl","tr","bl","br")
  const resizeElement = (elementId, info, e, handle = "br") => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(elementId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = rect.width;
    const startH = rect.height;
    const startLeft = info.left ?? rect.left;
    const startTop = info.top ?? rect.top;

    const onMouseMove = (ev) => {
      // delta scaled
      const dx = (ev.clientX - startX) * resizeScale;
      const dy = (ev.clientY - startY) * resizeScale;

      let newW = Math.round(startW + (handle.includes("r") ? dx : -dx));
      let newH = Math.round(startH + (handle.includes("b") ? dy : -dy));
      let newLeft = startLeft;
      let newTop = startTop;

      // constraints
      newW = Math.max(20, newW);
      newH = Math.max(20, newH);

      // if resizing from left handles, adjust left so the element appears anchored
      if (handle.includes("l")) {
        // how much width changed from left side
        const deltaW = newW - startW;
        newLeft = Math.round(startLeft - deltaW);
      }
      if (handle.includes("t")) {
        const deltaH = newH - startH;
        newTop = Math.round(startTop - deltaH);
      }

      // apply to DOM and state
      el.style.width = `${newW}px`;
      el.style.height = `${newH}px`;
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;

      setComponentProp(info.id, { width: newW, height: newH, left: newLeft, top: newTop });
    };

    const stop = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
  };

  // ROTATE: rotates around center, uses rotateScale multiplier on angle delta
  const rotateElement = (elementId, info, e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(elementId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = info.rotate ?? 0;

    const onMouseMove = (ev) => {
      const dx = ev.clientX - centerX;
      const dy = ev.clientY - centerY;
      const radians = Math.atan2(dy, dx);
      const angle = (radians * 180) / Math.PI;
      // calculate delta relative to startAngle then scale
      const delta = (angle - startAngle) * rotateScale;
      const newAngle = Math.round(startAngle + delta);
      el.style.transform = `rotate(${newAngle}deg)`;
      setComponentProp(info.id, { rotate: newAngle });
    };

    const stop = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
  };

  /*
  const removeComponent = () => {
      // console.log('remove component');
      const temp = components.filter(c=>c.id !== currentComponent.id)
      setCurrentComponent('')
      setComponents(temp)
  }
  */
  
  // remove by ID
  const removeComponent = (id) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (currentComponent && currentComponent.id === id) setCurrentComponent(null);
  };


  const removeBackground = () => {
    // Always target main_frame
    const comp = components.find(c => c.name === 'main_frame');
    if (!comp) return;  // nothing to remove

    const updatedComp = { ...comp, image: '' };  // clone with image removed
    setImage("");
    setComponents(components.map(c => c.id === comp.id ? updatedComp : c));

    // also reset currentComponent if it was main_frame
    if (currentComponent && currentComponent.id === comp.id) {
      setCurrentComponent(updatedComp);
    }
  };

  // inside MainAlt.jsx
  const setBackgroundImage = (url) => {
    const comp = components.find(c => c.name === 'main_frame');
    if (!comp) return;

    const updatedComp = { ...comp, image: url };
    setComponents(components.map(c => c.id === comp.id ? updatedComp : c));
    setCurrentComponent(updatedComp);
    setImage(url); // keep local state if you still need it
  };

  const opacityHandle = (e) => {
    setOpacity(parseFloat(e.target.value))
  }

  

  // SHAPES
  /*
  const createShape = (type) => {
    const shape = {
      id: Date.now(),
      name: 'shape',
      type, // 'rect' | 'circle' | 'triangle' | 'star'
      left: 25,
      top: 25,
      width: 200,
      height: 150,
      rotate,
      z_index: 2,
      color: "#3c3c3d",
      opacity: 1,
      moveElement,
      resizeElement,
      rotateElement,
      setCurrectComponent: setCurrentComponent,
      removeComponent: () => removeComponent(shape.id),
    };
    setComponents((prev) => [...prev, shape]);
    setCurrentComponent(shape);
  };
  */
 // create shapes, text, image — reuse previous behavior
  const createShape = (type) => {
    const shape = {
      id: Date.now(),
      name: "shape",
      type, // rect | circle | triangle | star
      left: 50,
      top: 50,
      width: 120,
      height: 120,
      rotate: 0,
      z_index: components.length + 1,
      color: "#3c3c3d",
      opacity: 1,
    };
    setComponents((prev) => [...prev, shape]);
    setCurrentComponent(shape);
  };

  /*
  const addText = () => {
    const text = {
      id: Date.now(),
      name: "text",
      type: "text",
      left: 50,
      top: 50,
      rotate: 0,
      z_index: 10,
      padding: 6,
      font: 22,
      title: "Add Text",
      weight: 400,
      color: "#3c3c3d",
      opacity: 1,
      moveElement,
      resizeElement,
      rotateElement,
      setCurrectComponent: setCurrentComponent,
      removeComponent: () => removeComponent(text.id),
    };
    setComponents((prev) => [...prev, text]);
    setCurrentComponent(text);
  };
  */
 const addText = () => {
    const t = {
      id: Date.now(),
      name: "text",
      type: "text",
      title: "Add Text",
      left: 60,
      top: 60,
      width: 200,
      height: 60,
      rotate: 0,
      z_index: components.length + 1,
      font: 22,
      padding: 6,
      weight: 400,
      color: "#000",
      textBgColor: "#ffffff",
      opacity: 1,
    };
    setComponents((prev) => [...prev, t]);
    setCurrentComponent(t);
  };

  /*
  const addImage = (url) => {
    const image = {
      id: Date.now(),
      name: "image",
      type: "image",
      left: 50,
      top: 50,
      width: 200,
      height: 150,
      rotate: 0,
      z_index: 5,
      opacity: 1,
      radius: 0,
      image: url,
      moveElement,
      resizeElement,
      rotateElement,
      setCurrectComponent: setCurrentComponent,
      removeComponent: () => removeComponent(image.id),
    };
    setComponents((prev) => [...prev, image]);
    setCurrentComponent(image);
  };
  */
 const addImage = (url) => {
    const im = {
      id: Date.now(),
      name: "image",
      type: "image",
      left: 60,
      top: 60,
      width: 200,
      height: 150,
      rotate: 0,
      z_index: components.length + 1,
      opacity: 1,
      radius: 0,
      image: url,
    };
    setComponents((prev) => [...prev, im]);
    setCurrentComponent(im);
  };

  
  
  useEffect(() => {
    if(components.length > 0 && !currentComponent){
      const mainFrame = components.find(c => c.name === 'main_frame');
      setCurrentComponent(mainFrame);
    }
  }, [components]);

  useEffect(() => {
    if(currentComponent){
        const index = components.findIndex(c=>c.id===currentComponent.id);
        if (index === -1) return;
        const temp = components.filter(c=>c.id !== currentComponent.id);
        if(currentComponent.name !== 'text'){
            components[index].width = width || currentComponent.width;
            components[index].height = height || currentComponent.height;
            components[index].rotate = rotate || currentComponent.rotate;
        }
        if(currentComponent.name === 'text'){
            components[index].padding = padding || currentComponent.padding
            components[index].font = font || currentComponent.font
            components[index].weight = weight || currentComponent.weight
            components[index].title = text || currentComponent.title
        }
        if(currentComponent.name === 'image'){
            components[index].radius = radius || currentComponent.radius
        }
        if(currentComponent.name === 'main_frame' && image){
            components[index].image = image || currentComponent.image
        }
        components[index].color = color || currentComponent.color
        if(currentComponent.name !== 'main_frame'){
            components[index].left = left || currentComponent.left
            components[index].top = top || currentComponent.top
            components[index].opacity = opacity || currentComponent.opacity
            components[index].z_index = zIndex || currentComponent.z_index
        }
        setComponents([...temp,components[index]])
        setColor('')
        setWidth('')
        setHeight('')
        setLeft('')
        setTop('')
        setRotate(0)
        setOpacity('')
        setZIndex('')
        setText('')
    }
  },[color,image,left,top,width,height,rotate,opacity,zIndex,padding,font,weight,text,radius])

  const bringForward = (id) => {
    setComponents(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const higher = next.find(c => c.z_index === next[idx].z_index + 1);
      if (higher) higher.z_index -= 1;
      next[idx].z_index += 1;
      return [...next];
    });
  };

  const sendBackward = (id) => {
    setComponents(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const lower = next.find(c => c.z_index === next[idx].z_index - 1);
      if (lower) lower.z_index += 1;
      next[idx].z_index -= 1;
      return [...next];
    });
  };

  const toggleVisibility = (id) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, hidden: !c.hidden } : c));
  };

  const toggleLock = (id) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, locked: !c.locked } : c));
  };


  useEffect(() => {
    const getDesign = async () => {
      try {
        const {data} = await newRequest.get(`/user-design/${designId}`)
        // console.log(data)
        const {design} = data
        for (let i=0; i<design.length; i++){
          design[i].setCurrectComponent = (a) => setCurrentComponent(a)
          design[i].moveElement = moveElement
          design[i].resizeElement = resizeElement
          design[i].rotateElement = rotateElement
          design[i].removeBackground = removeBackground
        }
        setComponents(design)
      } catch (error) {
        console.log(error)
      }
    }
    getDesign()
  }, [designId])

  // Upload image/template/background
  // Upload image/template/background (frontend)
  const handleUpload = async (e, category) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      const { data } = await newRequest.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Uploaded:", data);
      loadAssets(); // reload after upload
    } catch (error) {
      console.error("❌ Upload error:", error);
    }
  };

  const [assets, setAssets] = useState({
    designs: [],
    projects: [],
    templates: [],
    images: [],
    backgrounds: [],
  });

  const loadAssets = async () => {
    try {
      const categories = ["design", "project", "template", "image", "background"];
      const results = await Promise.all(categories.map((cat) => newRequest.get(`/upload/${cat}`)));
      // Expecting results[i].data.data array
      setAssets({
        designs: (results[0] && results[0].data && results[0].data.data) || [],
        projects: (results[1] && results[1].data && results[1].data.data) || [],
        templates: (results[2] && results[2].data && results[2].data.data) || [],
        images: (results[3] && results[3].data && results[3].data.data) || [],
        backgrounds: (results[4] && results[4].data && results[4].data.data) || [],
      });
    } catch (err) {
      console.error("Failed to load assets:", err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [designRes, bgRes] = await Promise.all([
          newRequest.get("/design-images"),
          newRequest.get("/background-images")
        ]);
        setDesignImages(designRes.data.images || []);
        setBackgroundImages(bgRes.data.images || []);
      } catch (error) {
        console.error("Error fetching design/background images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleUploadDesignImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingDesign(true);
      const res = await newRequest.post("/add-design-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDesignImages((prev) => [res.data.image, ...prev]);
    } catch (error) {
      console.error("Design image upload failed:", error);
    } finally {
      setUploadingDesign(false);
    }
  };

  const handleUploadBackgroundImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingBackground(true);
      const res = await newRequest.post("/add-background-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBackgroundImages((prev) => [res.data.image, ...prev]);
    } catch (error) {
      console.error("Background image upload failed:", error);
    } finally {
      setUploadingBackground(false);
    }
  };



  return (
    <div className="canva-main-container">
      
      <HeaderAlt
        components={components}
        designId={designId}
        toggleRightPanel={toggleRightPanel}
        toggleLayersPanel={toggleLayersPanel}
      />


      <div className="canva-layout">
        {/* Left Sidebar */}
        <div className="canva-sidebar">
          {menuItems.map((item) => (
            <div
              key={item.name}
              // onClick={() =>
              //   setElements(item.name === "uploadImage" ? "image" : item.name, item.name)
              // }
              onClick={() => setElements(item.name, item.name)}

              className={`canva-menu-item ${activeMenu === item.name ? "active" : ""}`}
            >
              <span className="canva-icon">{item.icon}</span>
              <span className="canva-text">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Left Panel */}
        <div className={`canva-side-panel ${leftPanelOpen ? "" : "collapsed"}`}>
          <div className="canva-side-panel-header" onClick={toggleLeftPanel}>
            {leftPanelOpen ? (
              <MdKeyboardArrowLeft className="canva-panel-toggle-icon" />
            ) : (
              <MdKeyboardArrowRight className="canva-panel-toggle-icon" />
            )}
          </div>

          {state === "design" && <TemplateDesignAlt />}
          {state === "shape" && (
            <div className="canva-shape-grid">
              <div onClick={() => createShape("rect")} className="canva-shape-item rect" />
              <div onClick={() => createShape("circle")} className="canva-shape-item circle" />
              <div
                onClick={() => createShape("triangle")}
                className="canva-shape-item triangle"
                style={{ clipPath: "polygon(50% 0,100% 100%,0 100%)" }}
              />
              <div
                onClick={() => createShape("star")}
                className="canva-shape-item star"
              />
            </div>
          )}
          {state === "image" && <MyImagesAlt addImage={addImage} />}
          {state === "text" && <button onClick={addText}>Add Text</button>}
          {state === "projects" && <ProjectsAlt />}

          {/* Upload panel */}
          {state === "uploadImage" && (
            <div className="upload-panel">
              <label className="upload-btn">
                <FaCloudUploadAlt /> Upload Image
                <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(e, "image")} />
              </label>

              <label className="upload-btn">
                <FaCloudUploadAlt /> Upload Background
                <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(e, "background")} />
              </label>

              <label className="upload-btn">
                <FaCloudUploadAlt /> Upload Template
                <input type="file" accept="application/json,image/*" hidden onChange={(e) => handleUpload(e, "template")} />
              </label>

              <label className="upload-btn">
                <FaCloudUploadAlt /> Upload Design / Project
                <input type="file" accept="application/json,image/*" hidden onChange={(e) => handleUpload(e, "design")} />
              </label>

              <div className="asset-gallery">
                {assets.images.map((img) => (
                  <img key={img._id || img.id} src={img.url || img.image_url || img.url} alt="" className="asset-thumb" onClick={() => addImage(img.url || img.image_url)} />
                ))}

                {assets.backgrounds.map((bg) => (
                  <img key={bg._id || bg.id} src={bg.url || bg.image_url} alt="" className="asset-thumb" onClick={() => setBackgroundImage(bg.url || bg.image_url)} />
                ))}

                {assets.templates.map((t) => (
                  <div key={t._id || t.id} className="asset-thumb template-thumb" onClick={() => {
                    // if template has an image preview use it, otherwise show name
                    if (t.url || t.image_url) setBackgroundImage(t.url || t.image_url);
                  }}>
                    {t.url || t.image_url ? <img src={t.url || t.image_url} alt="template" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ padding: 8 }}>{t.name || "Template"}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === 'images' && 
              <div className="scrollable" style={{ height: '88vh' }}>
                {/*<ImageAlt addImage={addImage} />*/}
                <InitialImage addImage={addImage} />

                {/* ---------- DESIGN IMAGES SECTION ---------- */}
                <div className="side-section">
                  <h3>🎨 Design Images</h3>
                  <label className="upload-btn">
                    {uploadingDesign ? "Uploading..." : "Upload Design Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadDesignImage}
                      hidden
                    />
                  </label>

                  <div className="image-grid">
                    {designImages.map((img) => (
                      <img
                        key={img._id}
                        src={img.image_url}
                        alt="design"
                        className="image-thumb"
                      />
                    ))}
                  </div>
                </div>
              </div>
            }
            
            {state === 'background' && (
              <div className="scrollable" style={{ height: '88vh' }}>
                <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <BackgroundImage type='background' setImage={setImage} />

                  {/*<BackgroundImage setBackgroundImage={setBackgroundImage} removeBackground={removeBackground} /> */}
                  {/* ---------- BACKGROUND IMAGES SECTION ---------- */}
                  <div className="side-section">
                    <h3>🖼️ Background Images</h3>
                    <label className="upload-btn">
                      {uploadingBackground ? "Uploading..." : "Upload Background Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadBackgroundImage}
                        hidden
                      />
                    </label>

                    <div className="image-grid">
                      {backgroundImages.map((img) => (
                        <img
                          key={img._id}
                          src={img.image_url}
                          alt="background"
                          className="image-thumb"
                        />
                      ))}
                    </div>
                  </div>
                
                </div>
              </div>
            )}


        </div>

        {/* Canvas */}
        {/* Canvas */}
        <div className="canva-canvas-wrapper">
          <div id="main_design" className="canva-canvas">
            {components.map((c, i) => (
              <CreateComponentAlt
                key={i}
                info={c}
                current_component={currentComponent}
                removeComponent={removeComponent}
                setCurrentComponent={(comp) => {
                  const found = components.find((x) => x.id === comp.id) || comp;
                  setCurrentComponent(found);
                }}
                handlers={{ moveElement, resizeElement, rotateElement }}
              />
            ))}
          </div>
        </div>


        {/* Right Panel */}
        {currentComponent && (
          <div className={`canva-side-panel-right ${rightPanelOpen ? "" : "collapsed"}`}  >
            <div className="canva-side-panel-header" onClick={toggleRightPanel}>
              <MdKeyboardArrowRight />
            </div>
            {/* Right panel content (color picker, opacity, text, image) */}
            {/* ... Keep your existing right panel JSX here ... */}

              {/* Scales for move/resize/rotate */}
              <div style={{ padding: 12 }}>
                <div>
                  <label>Move sensitivity</label>
                  <input type="range" min="0.2" max="2" step="0.1" value={moveScale} onChange={(e) => setMoveScale(Number(e.target.value))} />
                </div>
                <div>
                  <label>Resize sensitivity</label>
                  <input type="range" min="0.2" max="2" step="0.1" value={resizeScale} onChange={(e) => setResizeScale(Number(e.target.value))} />
                </div>
                <div>
                  <label>Rotate sensitivity</label>
                  <input type="range" min="0.2" max="2" step="0.1" value={rotateScale} onChange={(e) => setRotateScale(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ padding: 12 }}>
                <div>
                  <label>X (left)</label>
                  <input type="range" min={-1000} max={2000} step="1" value={currentComponent.left ?? 0} onChange={(e) => onRangeChange("left", e.target.value)} />
                  <div>{currentComponent.left ?? 0}px</div>
                </div>

                <div>
                  <label>Y (top)</label>
                  <input type="range" min={-1000} max={2000} step="1" value={currentComponent.top ?? 0} onChange={(e) => onRangeChange("top", e.target.value)} />
                  <div>{currentComponent.top ?? 0}px</div>
                </div>

                <div>
                  <label>Width</label>
                  <input type="range" min={10} max={2000} step="1" value={currentComponent.width ?? 0} onChange={(e) => onRangeChange("width", e.target.value)} />
                  <div>{currentComponent.width ?? 0}px</div>
                </div>

                <div>
                  <label>Height</label>
                  <input type="range" min={10} max={2000} step="1" value={currentComponent.height ?? 0} onChange={(e) => onRangeChange("height", e.target.value)} />
                  <div>{currentComponent.height ?? 0}px</div>
                </div>

                <div>
                  <label>Rotation</label>
                  <input type="range" min={-360} max={360} step="1" value={Math.round(currentComponent.rotate ?? 0)} onChange={(e) => onRangeChange("rotate", e.target.value)} />
                  <div>{Math.round(currentComponent.rotate ?? 0)}°</div>
                </div>
              </div>


              <div className="canva-color-picker-row">
                <span>Color:</span>
                <label
                  className="canva-color-box"
                  style={{
                    background: currentComponent.color && currentComponent.color !== "#fff" ? currentComponent.color : "gray"
                  }}
                  htmlFor="color"
                />
                <input
                  type="color"
                  id="color"
                  name="color"
                  className="canva-color-input"
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              {/* Color Controls */}
                {currentComponent.name === "main_frame" && (
                  <>
                    <div className="canva-color-picker-row">
                      <span>Background Color:</span>
                      <input
                        type="color"
                        value={currentComponent.bgColor ?? bgColor}
                        onChange={(e) =>
                          setComponentProp(currentComponent.id, {
                            bgColor: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label>Opacity:</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={currentComponent.opacity ?? 1}
                        onChange={(e) =>
                          setComponentProp(currentComponent.id, {
                            opacity: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {/* Conditional Settings */}
                {currentComponent.name === 'main_frame' && currentComponent.image && (
                  <button onClick={removeBackground} className="canva-remove-bg-btn">Remove Background</button>
                )}

                {currentComponent.name !== 'main_frame' && (
                  <div className="canva-opacity-settings">
                    <div className="canva-opacity-row">
                      <span className="canva-opacity-label">Opacity:</span>
                      <input
                        type="number"
                        step={0.1}
                        min={0.1}
                        max={1}
                        className="canva-opacity-input"
                        value={currentComponent.opacity}
                        onChange={opacityHandle}
                      />
                    </div>

                    <div className="canva-zindex-row">
                      <span className="canva-opacity-label">Z-Index:</span>
                      <input
                        type="number"
                        step={0.1}
                        min={0.1}
                        max={1}
                        className="canva-opacity-input"
                        value={currentComponent.z_index}
                        onChange={(e) => setZIndex(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {currentComponent.name === 'image' && (
                  <div className="canva-opacity-row">
                    <span className="canva-opacity-label">Radius:</span>
                    <input
                      type="number"
                      step={1}
                      name="radius"
                      className="canva-opacity-input"
                      value={currentComponent.radius}
                      onChange={(e) => setRadius(parseInt(e.target.value))}
                    />
                  </div>
                )}

                {currentComponent.name === 'text' && (
                  <div className="canva-text-settings">
                    <div className="canva-setting-row">
                      <span>Padding:</span>
                      <input
                        type="number"
                        step={1}
                        className="canva-custom-input"
                        value={currentComponent.padding ?? 0}
                        onChange={(e) => setComponentProp(currentComponent.id, { padding: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="canva-setting-row">
                      <span>Font Size:</span>
                      <input
                        type="number"
                        step={1}
                        className="canva-custom-input"
                        value={currentComponent.font ?? 16}
                        onChange={(e) => setComponentProp(currentComponent.id, { font: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="canva-setting-row">
                      <span>Weight:</span>
                      <input
                        type="number"
                        step={100}
                        className="canva-custom-input"
                        value={currentComponent.weight ?? 400}
                        onChange={(e) => setComponentProp(currentComponent.id, { weight: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="canva-setting-row">
                      <span>Text:</span>
                      <input
                        type="text"
                        className="canva-custom-input"
                        value={currentComponent.title ?? ""}
                        onChange={(e) => setComponentProp(currentComponent.id, { title: e.target.value })}
                      />
                    </div>

                    <div className="canva-setting-row">
                      <span>Text Background:</span>
                      <input
                        type="color"
                        value={currentComponent.textBgColor ?? textBgColor}
                        onChange={(e) =>
                          setComponentProp(currentComponent.id, {
                            textBgColor: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="canva-setting-row">
                      <span>Text Color:</span>
                      <input
                        type="color"
                        value={currentComponent.color ?? "#000"}
                        onChange={(e) =>
                          setComponentProp(currentComponent.id, {
                            color: e.target.value,
                          })
                        }
                      />
                    </div>

                  </div>
                )}


              </div>
          
        )}
      </div>

        {showLayersPanel && (
          <LayersPanel
            components={components}
            currentComponent={currentComponent}
            setCurrentComponent={setCurrentComponent}
            removeComponent={removeComponent}
            bringForward={bringForward}
            sendBackward={sendBackward}
            toggleVisibility={toggleVisibility}
            toggleLock={toggleLock}
          />
        )}


    </div>
  );
};

export default Main;

