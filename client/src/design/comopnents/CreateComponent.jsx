import React from 'react'
import { BsTrash } from 'react-icons/bs'
import ElementAlt from './ElementAlt'

const CreateComponent = ({info, current_component,removeComponent,setCurrentComponent}) => {
  
    const randValue = Math.floor(Math.random() * 100)
    let html = ''
    if(info.name === 'main_frame'){
        html = <div className='hover:border-[2px] hover:border-indigo-500 shadow-md' 
         style={{
            width: info.width + 'px',
            height: info.height + 'px',
            background: info.color,
            zIndex: info.z_index
         }}
        >
            {
                info.image && <img className='w-full h-full' src={info.image} alt="image" />
            }
        </div>
    }
    if (info.name === 'shape' && info.type === 'rect') {
        html =
            <div
            id={randValue}
            className="absolute group hover:border-[2px] hover:border-indigo-500"
            onClick={() => setCurrentComponent(info)}
            style={{
                width: info.width + 'px',
                height: info.height + 'px',
                background: info.color,
                zIndex: info.z_index,
                opacity: info.opacity,
                left: info.left,
                top: info.top,
                transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)'
            }}
            >
                <Element id={randValue} info={info} exId="" />
            {
                current_component.id === info.id && <div onClick={()=>removeComponent(info.id)} className='px-3 py-2 bg-white absolute top-0 hidden group-hover:block cursor-pointer rounded-md' >
                    <BsTrash />
                </div>
            }
            </div>
        ;
    }
    if (info.name === 'shape' && info.type === 'circle') {
        html =
            <div
            id={randValue}
            className="absolute group hover:border-[2px] hover:border-indigo-500"
            onClick={() => setCurrentComponent(info)}
            style={{
                zIndex: info.z_index,
                left: info.left,
                top: info.top,
                transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)'
            }}
            >
                <Element id={randValue} info={info} exId={`${randValue}c`} />
                <div id={`${randValue}c`} className='rounded-full' 
                    style={{
                        width: info.width + 'px',
                        height: info.height + 'px',
                        background: info.color,
                        opacity: info.opacity
                    }}
                >

                </div>
            {
                current_component.id === info.id && <div onClick={()=>removeComponent(info.id)} className='px-3 py-2 bg-white absolute top-0 hidden group-hover:block cursor-pointer rounded-md' >
                    <BsTrash />
                </div>
            }
            </div>
        ;
    }
    if (info.name === 'shape' && info.type === 'triangle') {
        html =
            <div
            id={randValue}
            className="absolute group hover:border-[2px] hover:border-indigo-500"
            onClick={() => setCurrentComponent(info)}
            style={{
                zIndex: info.z_index,
                left: info.left,
                top: info.top,
                transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)'
            }}
            >
                <Element id={randValue} info={info} exId={`${randValue}t`} />
                <div id={`${randValue}t`}
                    style={{
                        width: info.width + 'px',
                        height: info.height + 'px',
                        background: info.color,
                        opacity: info.opacity,
                        clipPath:'polygon(50% 0,100% 100%,0 100%)'
                    }}
                >

                </div>
            {
                current_component.id === info.id && <div onClick={()=>removeComponent(info.id)} className='px-3 py-2 bg-white absolute top-0 hidden group-hover:block cursor-pointer rounded-md' >
                    <BsTrash />
                </div>
            }
            </div>
        ;
    }
    // ⭐ STAR SHAPE
    // ⭐ STAR SHAPE
    if (info.name === "shape" && info.type === "star") {
        html = (
            <div
            id={randValue}
            className="absolute group hover:border-[2px] hover:border-indigo-500"
            onClick={() => setCurrentComponent(info)}
            style={{
                zIndex: info.z_index,
                left: info.left,
                top: info.top,
                transform: info.rotate ? `rotate(${info.rotate}deg)` : "rotate(0deg)",
                cursor: "move",
            }}
            >
            {/* Resize/Rotate Handles */}
            <Element id={randValue} info={info} exId={`${randValue}s`} />

            {/* Star Shape Itself */}
            <div
                id={`${randValue}s`}
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

            {/* Delete Button */}
            {current_component.id === info.id && (
                <div
                onClick={() => removeComponent(info.id)}
                className="px-3 py-2 bg-white absolute top-0 hidden group-hover:block cursor-pointer rounded-md"
                >
                <BsTrash />
                </div>
            )}
            </div>
        );
    }
    if (info.name === 'text') {
        html =
            <div
            id={randValue}
            className="absolute group hover:border-[2px] hover:border-indigo-500"
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
                <h2 className='w-full h-full' style={{
                    fontSize:info.font+'px',
                    fontWeight:info.weight
                  }} 
                >
                    {info.title}
                </h2>
            {
                current_component.id === info.id && <div onClick={()=>removeComponent(info.id)} className='px-3 py-2 bg-white absolute top-0 hidden group-hover:block cursor-pointer rounded-md' >
                    <BsTrash />
                </div>
            }
            </div>
        ;
    }
    if (info.name === 'image') {
        html =
            <div
            id={randValue}
            className="absolute group hover:border-[2px] hover:border-indigo-500"
            onClick={() => setCurrentComponent(info)}
            style={{
                zIndex: info.z_index,
                left: info.left,
                top: info.top,
                transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
                opacity: info.opacity,
            }}
            >
                <Element id={randValue} info={info} exId={`${randValue}img`} />
                <div 
                    className='overflow-hidden'
                    id={`${randValue}img`}
                    style={{
                        width: info.width + 'px',
                        height: info.height + 'px',
                        borderRadius: `${info.radius}`
                    }}
                >
                    <img className='w-full h-full' src={info.image} alt="image" />
                </div>
            {
                current_component.id === info.id && <div onClick={()=>removeComponent(info.id)} className='px-3 py-2 bg-white absolute top-0 hidden group-hover:block cursor-pointer rounded-md' >
                    <BsTrash />
                </div>
            }
            </div>
        ;
    }
  
    return html;
}

export default CreateComponent