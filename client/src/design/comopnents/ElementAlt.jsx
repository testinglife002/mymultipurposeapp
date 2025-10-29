// ✅ src/design/components/ElementAlt.jsx
// ElementAlt.jsx
// src/design/components/ElementAlt.jsx
import React from "react";
import "./ElementAlt.css";

/*
 ElementAlt renders:
  - move overlay (ea-move-zone)
  - 4 corner handles with data-handle (tl,tr,bl,br)
  - rotate handle above element
 It calls handlers passed from Main (via CreateComponentAlt).
*/

const ElementAlt = ({ id: elementId, info, handlers }) => {
  // handlers: { moveElement, resizeElement, rotateElement }
  const moveFn = handlers?.moveElement;
  const resizeFn = handlers?.resizeElement;
  const rotateFn = handlers?.rotateElement;

  if (!moveFn || !resizeFn || !rotateFn) {
    // nothing to do
    return null;
  }

  return (
    <>
      {/* center overlay for move */}
      <div
        className="ea-move-zone"
        onMouseDown={(e) => {
          // pass elementId and info
          moveFn(elementId, info, e);
        }}
      />

      {/* corners - pass handle string so Main can differentiate */}
      <div
        className="ea-handle ea-top-left"
        onMouseDown={(e) => {
          resizeFn(elementId, info, e, "tl");
        }}
      />
      <div
        className="ea-handle ea-top-right"
        onMouseDown={(e) => {
          resizeFn(elementId, info, e, "tr");
        }}
      />
      <div
        className="ea-handle ea-bottom-left"
        onMouseDown={(e) => {
          resizeFn(elementId, info, e, "bl");
        }}
      />
      <div
        className="ea-handle ea-bottom-right"
        onMouseDown={(e) => {
          resizeFn(elementId, info, e, "br");
        }}
      />

      {/* rotate handle */}
      <div
        className="ea-rotate-handle"
        onMouseDown={(e) => {
          rotateFn(elementId, info, e);
        }}
      />
    </>
  );
};

export default ElementAlt;


/*
import React from "react";
import "./ElementAlt.css";

const ElementAlt = ({ id, info, exId, handlers }) => {

   // prefer handlers passed explicitly (CreateComponentAlt passes `handlers`), fallback to functions on info object
  const moveFn = handlers?.moveElement || info.moveElement;
  const resizeFn = handlers?.resizeElement || info.resizeElement;
  const rotateFn = handlers?.rotateElement || info.rotateElement;

  const domId = id; // id already `elem-{info.id}` from CreateComponentAlt

  const elementId = exId || id;

  const handleMove = (e) => {
    e.stopPropagation();
    handlers?.moveElement(elementId, info, e) || info.moveElement(elementId, info, e);
  };

  const handleResize = (e) => {
    e.stopPropagation();
    handlers?.resizeElement(elementId, info, e) || info.resizeElement(elementId, info, e);
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    handlers?.rotateElement(elementId, info, e) || info.rotateElement(elementId, info, e);
  };

  return (
    <>
    
      <div className="ea-move-zone" onMouseDown={handleMove}></div>

   
      <div onMouseDown={handleResize} className="ea-handle ea-top-left" />
      <div onMouseDown={handleResize} className="ea-handle ea-top-right" />
      <div onMouseDown={handleResize} className="ea-handle ea-bottom-left" />
      <div onMouseDown={handleResize} className="ea-handle ea-bottom-right" />

     
      <div onMouseDown={handleRotate} className="ea-rotate-handle" />
    </>
  );
};

export default ElementAlt;
*/



/*
import React from "react";
import "./ElementAlt.css";

const ElementAlt = ({ id, info, exId }) => {
  const elementId = exId || id;

  return (
    <>
   
      <div onMouseDown={() => info.resizeElement(elementId, info)} className="resize-handle top-left" />
      <div onMouseDown={() => info.resizeElement(elementId, info)} className="resize-handle top-right" />
      <div onMouseDown={() => info.resizeElement(elementId, info)} className="resize-handle bottom-left" />
      <div onMouseDown={() => info.resizeElement(elementId, info)} className="resize-handle bottom-right" />

     
      <div onMouseDown={() => info.rotateElement(elementId, info)} className="resize-handle rotate-handle" />

     
      <div onMouseDown={() => info.moveElement(elementId, info)} className="resize-handle top-center" />
      <div onMouseDown={() => info.moveElement(elementId, info)} className="resize-handle middle-left" />
      <div onMouseDown={() => info.moveElement(elementId, info)} className="resize-handle middle-right" />
      <div onMouseDown={() => info.moveElement(elementId, info)} className="resize-handle bottom-center" />
    </>
  );
};

export default ElementAlt;
*/

/*
import React from "react";

const ElementAlt = ({ id, info }) => {
  const elem = document.getElementById(id);

  const startDrag = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = elem.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    const onMouseMove = (eMove) => {
      elem.style.left = eMove.clientX - offsetX + "px";
      elem.style.top = eMove.clientY - offsetY + "px";
      info.left = eMove.clientX - offsetX;
      info.top = eMove.clientY - offsetY;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = elem.offsetWidth;
    const startHeight = elem.offsetHeight;

    const onMouseMove = (eMove) => {
      const newWidth = startWidth + (eMove.clientX - startX);
      const newHeight = startHeight + (eMove.clientY - startY);
      elem.style.width = newWidth + "px";
      elem.style.height = newHeight + "px";
      info.width = newWidth;
      info.height = newHeight;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const startRotate = (e) => {
    e.stopPropagation();
    const rect = elem.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const startAngle = info.rotate || 0;

    const onMouseMove = (eMove) => {
      const dx = eMove.clientX - cx;
      const dy = eMove.clientY - cy;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      elem.style.transform = `rotate(${angle}deg)`;
      info.rotate = angle;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      <div className="handle move-handle" onMouseDown={startDrag} />
      <div className="handle resize-handle" onMouseDown={startResize} />
      <div className="handle rotate-handle" onMouseDown={startRotate} />
    </>
  );
};

export default ElementAlt;
*/





