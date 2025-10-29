// ✅ src/design/components/CreateComponentAlt.jsx
// src/design/components/CreateComponentAlt.jsx
// ✅ src/design/components/CreateComponentAlt.jsx
// ✅ src/design/components/CreateComponentAlt.jsx
import React from "react";
import { BsTrash } from "react-icons/bs";
import ElementAlt from "./ElementAlt";
import "./CreateComponentAlt.css";

const CreateComponentAlt = ({
  info,
  current_component,
  removeComponent,
  setCurrentComponent,
  handlers,
}) => {
  const elementId = `elem-${info.id}`;
  const isActive = current_component && current_component.id === info.id;

  const style = {
    position: "absolute",
    left: `${info.left ?? 0}px`,
    top: `${info.top ?? 0}px`,
    width: `${info.width ?? 100}px`,
    height: `${info.height ?? 100}px`,
    transform: `rotate(${info.rotate ?? 0}deg)`,
    opacity: typeof info.opacity === "number" ? info.opacity : 1,
    zIndex: info.z_index ?? 1,
    userSelect: "none",
    boxSizing: "border-box",
    cursor: "move",
    border: isActive ? "2px solid #1e90ff" : "1px solid transparent",
    borderRadius: info.radius ?? 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    fontSize: info.font ?? 16,
    fontWeight: info.weight ?? 400,
    padding: info.padding ?? 6,
    background:
      info.name === "main_frame"
        ? info.bgColor ?? "#ffffff"
        : info.name === "text"
        ? info.textBgColor ?? "transparent"
        : "transparent",
    color: info.color ?? "#000000",
  };

  const renderShape = () => {
    const shapeColor = info.color ?? "#cccccc";
    switch (info.type) {
      case "circle":
        return (
          <div
            className="shape circle"
            style={{
              backgroundColor: shapeColor,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        );
      case "triangle":
        return (
          <div
            className="shape triangle"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${(info.width ?? 100) / 2}px solid transparent`,
              borderRight: `${(info.width ?? 100) / 2}px solid transparent`,
              borderBottom: `${info.height ?? 100}px solid ${shapeColor}`,
            }}
          />
        );
      case "star":
        return (
          <div
            className="shape star"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: shapeColor,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        );
      default:
        return (
          <div
            className="shape rect"
            style={{
              backgroundColor: shapeColor,
              width: "100%",
              height: "100%",
            }}
          />
        );
    }
  };

  const renderContent = () => {
    switch (info.name) {
      case "text":
        return (
          <div
            className="text-element"
            style={{
              width: "100%",
              height: "100%",
              background: info.textBgColor ?? "transparent",
              color: info.color ?? "#000",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              whiteSpace: "pre-wrap",
            }}
          >
            {info.title || "Text"}
          </div>
        );

      case "image":
        return (
          <img
            src={info.image}
            alt=""
            draggable="false"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: info.radius ?? 0,
            }}
          />
        );

      case "shape":
        return renderShape();

      case "main_frame":
        return info.image ? (
          <img
            src={info.image}
            alt="background"
            draggable="false"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: info.opacity ?? 1,
            }}
          />
        ) : (
          <div
            style={{
              backgroundColor: info.bgColor ?? "#ffffff",
              width: "100%",
              height: "100%",
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      id={elementId}
      style={style}
      className={`canvas-element ${isActive ? "active" : ""}`}
      onMouseDown={(e) => {
        if (info.locked) return;
        setCurrentComponent(info);
        handlers.moveElement(elementId, info, e);
      }}
      onClick={() => setCurrentComponent(info)}
    >
      {renderContent()}

      {isActive && (
        <>
          <ElementAlt id={elementId} info={info} handlers={handlers} />
          {info.name !== "main_frame" && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeComponent(info.id);
              }}
            >
              <BsTrash />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CreateComponentAlt;





/*
import React from "react";
import { BsTrash } from "react-icons/bs";
import ElementAlt from "./ElementAlt";
import "./CreateComponentAlt.css";

const CreateComponentAlt = ({
  info,
  current_component,
  removeComponent,
  setCurrentComponent,
  handlers 
}) => {

  const randValue = Math.floor(Math.random() * 100);
  // const elementId = info.id;
  const elementId = `elem-${info.id}`;
  const domId = `elem-${info.id}`;

  const isActive = current_component && current_component.id === info.id;

  const baseStyle = {
    position: "absolute",
    left: info.left || 0,
    top: info.top || 0,
    width: info.width ? `${info.width}px` : "auto",
    height: info.height ? `${info.height}px` : "auto",
    transform: `rotate(${info.rotate || 0}deg)`,
    opacity: info.opacity,
    zIndex: info.z_index,
    cursor: "move",
  };

  let html = '';

  // MAIN FRAME → only background
  if (info.name === 'main_frame') {
    console.log("Rendering main_frame with image:", info.image);
    html = (
      <div
        className="main-frame"
        onClick={() => setCurrentComponent(info)}
        style={{
          width: `${info.width}px`,
          height: `${info.height}px`,
          backgroundColor: info.color || '#fff',
          backgroundImage: info.image ? `url(${info.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: info.z_index,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
       
        {info.image && (
          <img className="main-frame-img" src={info.image} alt="image" />
        )}
      </div>
    );
  }

  // RECTANGLE
  if (info.name === 'shape' && info.type === 'rect') {
    html = (
      <div
        id={randValue}
        className="shape shape-rect"
        onClick={() => setCurrentComponent(info)}
        style={{
          width: info.width + 'px',
          height: info.height + 'px',
          background: info.color,
          zIndex: info.z_index,
          opacity: info.opacity,
          left: info.left,
          top: info.top,
          transform: info.rotate
            ? `rotate(${info.rotate}deg)`
            : 'rotate(0deg)'
        }}
      >
        <ElementAlt id={randValue} info={info} exId="" handlers={handlers} />
        {current_component.id === info.id && (
          <div
            onClick={() => removeComponent(info.id)}
            className="delete-btn"
          >
            <BsTrash />
          </div>
        )}
      </div>
    );
  }

  // CIRCLE
  if (info.name === 'shape' && info.type === 'circle') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate
            ? `rotate(${info.rotate}deg)`
            : 'rotate(0deg)'
        }}
      >
        <ElementAlt id={randValue} info={info} exId={`${randValue}c`} handlers={handlers} />
        <div
          id={`${randValue}c`}
          className="shape-circle"
          style={{
            width: info.width + 'px',
            height: info.height + 'px',
            background: info.color,
            opacity: info.opacity
          }}
        ></div>
        {current_component.id === info.id && (
          <div
            onClick={() => removeComponent(info.id)}
            className="delete-btn"
          >
            <BsTrash />
          </div>
        )}
      </div>
    );
  }

  // TRIANGLE
  if (info.name === 'shape' && info.type === 'triangle') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate
            ? `rotate(${info.rotate}deg)`
            : 'rotate(0deg)'
        }}
      >
        <ElementAlt id={randValue} info={info} exId={`${randValue}t`} handlers={handlers} />
        <div
          id={`${randValue}t`}
          className="shape-triangle"
          style={{
            width: info.width + 'px',
            height: info.height + 'px',
            background: info.color,
            opacity: info.opacity
          }}
        ></div>
        {current_component.id === info.id && (
          <div
            onClick={() => removeComponent(info.id)}
            className="delete-btn"
          >
            <BsTrash />
          </div>
        )}
      </div>
    );
  }

  // ⭐ STAR SHAPE
  if (info.name === "shape" && info.type === "star") {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : "rotate(0deg)",
          cursor: "move",
          clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
        }}
      >
    
        <ElementAlt id={randValue} info={info} exId={`${randValue}s`} handlers={handlers} />

    
        <div
          id={`${randValue}s`}
          className="shape-star"
          style={{
            width: `${info.width}px`,
            height: `${info.height}px`,
            background: info.color,
            opacity: info.opacity,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            pointerEvents: "none",
          }}
        ></div>

     
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }

  // Text
  if (info.name === 'text') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
            zIndex: info.z_index,
            left: info.left,
            top: info.top,
            transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
            padding: info.padding + 'px',
            color: info.color,
            opacity: info.opacity,
        }}
      >
        <ElementAlt id={randValue} info={info} exId="" handlers={handlers} />
        <h2 className='w-100 h-100' 
            style={{
                fontSize:info.font+'px',
                fontWeight:info.weight
            }} 
        >
            {info.title}
        </h2>
        {current_component.id === info.id && (
          <div
            onClick={() => removeComponent(info.id)}
            className="delete-btn"
          >
            <BsTrash />
          </div>
        )}
      </div>
    );
  }

  // Image
  if (info.name === 'image') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
            zIndex: info.z_index,
            left: info.left,
            top: info.top,
            transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
            opacity: info.opacity,
        }}
      >
        <ElementAlt id={randValue} info={info} exId={`${randValue}img`} handlers={handlers} />
        <div 
             className='overflow-hidden'
            id={`${randValue}img`}
            style={{
                width: info.width + 'px',
                height: info.height + 'px',
                borderRadius: `${info.radius}%`
            }}
        >
            <img className='w-100 h-100' src={info.image} alt="image" />
        </div>
        {current_component.id === info.id && (
          <div
            onClick={() => removeComponent(info.id)}
            className="delete-btn"
          >
            <BsTrash />
          </div>
        )}
      </div>
    );
  }

  return html;
};

export default CreateComponentAlt;
*/



/*
import React from "react";
import { BsTrash } from "react-icons/bs";
import ElementAlt from "./ElementAlt";

const CreateComponentAlt = ({ info, current_component, removeComponent, setCurrentComponent }) => {
  // Use stable ID
  const elemId = `comp-${info.id}`;

  const styleCommon = {
    position: "absolute",
    left: info.left + "px",
    top: info.top + "px",
    zIndex: info.z_index,
    opacity: info.opacity,
    transform: `rotate(${info.rotate || 0}deg)`,
    cursor: "move",
  };

  const isSelected = current_component?.id === info.id;

  return (
    <div
      id={elemId}
      className="component-wrapper"
      onMouseDown={() => setCurrentComponent(info)}
      style={styleCommon}
    >
     
      {info.type === "rect" && <div style={{ width: info.width, height: info.height, background: info.color }} />}
      {info.type === "circle" && <div style={{ width: info.width, height: info.height, borderRadius: "50%", background: info.color }} />}
      {info.type === "triangle" && (
        <div
          style={{
            width: info.width,
            height: info.height,
            background: info.color,
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
          }}
        />
      )}
      {info.type === "star" && (
        <div
          style={{
            width: info.width,
            height: info.height,
            background: info.color,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      )}
      {info.type === "text" && (
        <h2 style={{ fontSize: info.font, fontWeight: info.weight, padding: info.padding, color: info.color }}>
          {info.title}
        </h2>
      )}
      {info.type === "image" && (
        <div style={{ width: info.width, height: info.height, borderRadius: info.radius + "%", overflow: "hidden" }}>
          <img src={info.image} style={{ width: "100%", height: "100%" }} />
        </div>
      )}

     
      {isSelected && <ElementAlt id={elemId} info={info} />}

    
      {isSelected && (
        <div onClick={() => removeComponent(info.id)} className="delete-btn">
          <BsTrash />
        </div>
      )}
    </div>
  );
};

export default CreateComponentAlt;
*/


/*
import React from 'react';
import { BsTrash } from 'react-icons/bs';
import './CreateComponentAlt.css';
import ElementAlt from './ElementAlt';

const CreateComponentAlt = ({
  info,
  current_component,
  removeComponent,
  setCurrentComponent,
}) => {
  const randValue = Math.floor(Math.random() * 100);
  let html = '';

  // MAIN FRAME
  if (info.name === 'main_frame') {
    html = (
      <div
        className="main-frame"
        onClick={() => setCurrentComponent(info)}
        style={{
          width: `${info.width}px`,
          height: `${info.height}px`,
          backgroundColor: info.color || '#fff',
          backgroundImage: info.image ? `url(${info.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: info.z_index,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {info.image && (
          <img className="main-frame-img" src={info.image} alt="background" />
        )}
      </div>
    );
  }

  // RECTANGLE
  // RECTANGLE
  if (info.name === 'shape' && info.type === 'rect') {
    
    const elementId = info.id || `shape-${randValue}`;
    html = (
      <div
        id={elementId}
        className="shape shape-rect"
        onClick={() => setCurrentComponent(info)}
        style={{
          width: `${info.width}px`,
          height: `${info.height}px`,
          background: info.color,
          zIndex: info.z_index,
          opacity: info.opacity,
          position: 'absolute',
          left: `${info.left || 0}px`,
          top: `${info.top || 0}px`,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
          cursor: 'move',
        }}
      >
        <ElementAlt id={elementId} info={info} exId="" />
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }


  // CIRCLE
  if (info.name === 'shape' && info.type === 'circle') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
        }}
      >
        <ElementAlt id={randValue} info={info} exId={`${randValue}c`} />
        <div
          id={`${randValue}c`}
          className="shape-circle"
          style={{
            width: info.width + 'px',
            height: info.height + 'px',
            background: info.color,
            opacity: info.opacity,
          }}
        ></div>
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }

  // TRIANGLE
  if (info.name === 'shape' && info.type === 'triangle') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
        }}
      >
        <ElementAlt id={randValue} info={info} exId={`${randValue}t`} />
        <div
          id={`${randValue}t`}
          className="shape-triangle"
          style={{
            width: info.width + 'px',
            height: info.height + 'px',
            background: info.color,
            opacity: info.opacity,
          }}
        ></div>
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }

  // ⭐ STAR SHAPE
  // ⭐ STAR SHAPE
  if (info.name === "shape" && info.type === "star") {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : "rotate(0deg)",
          cursor: "move",
        }}
      >
  
        <ElementAlt id={randValue} info={info} exId={`${randValue}s`} />

    
        <div
          id={`${randValue}s`}
          className="shape-star"
          style={{
            width: `${info.width}px`,
            height: `${info.height}px`,
            background: info.color,
            opacity: info.opacity,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            pointerEvents: "none",
          }}
        ></div>

   
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }



  // TEXT
  if (info.name === 'text') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
          padding: info.padding + 'px',
          color: info.color,
          opacity: info.opacity,
        }}
      >
        <ElementAlt id={randValue} info={info} exId="" />
        <h2
          className="text-content"
          style={{
            fontSize: info.font + 'px',
            fontWeight: info.weight,
          }}
        >
          {info.title}
        </h2>
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }

  // IMAGE
  if (info.name === 'image') {
    html = (
      <div
        id={randValue}
        className="shape"
        onClick={() => setCurrentComponent(info)}
        style={{
          zIndex: info.z_index,
          left: info.left,
          top: info.top,
          transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
          opacity: info.opacity,
        }}
      >
        <ElementAlt id={randValue} info={info} exId={`${randValue}img`} />
        <div
          id={`${randValue}img`}
          className="img-wrapper"
          style={{
            width: info.width + 'px',
            height: info.height + 'px',
            borderRadius: `${info.radius}%`,
          }}
        >
          <img src={info.image} alt="uploaded" />
        </div>
        {current_component.id === info.id && (
          <div onClick={() => removeComponent(info.id)} className="delete-btn">
            <BsTrash className="trash-icon" />
          </div>
        )}
      </div>
    );
  }

  return html;
};

export default CreateComponentAlt;
*/

