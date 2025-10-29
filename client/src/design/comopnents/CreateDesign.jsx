import React, { useRef } from 'react'
import * as htmlToImage from 'html-to-image';
import { useLocation, useNavigate } from 'react-router-dom';
import newRequest from "../../api/newRequest";
import RotateLoader from 'react-spinners/RotateLoader';
import { useState } from 'react';
import { useEffect } from 'react';
import CreateComponent from './CreateComponent';




const CreateDesign = () => {

    const ref = useRef()

     const {state} = useLocation();
      console.log(state);


    if (!state || !state.width || !state.height) {
      return <div className="text-center mt-5">No design data provided.</div>;
    }

    const navigate = useNavigate();

    const obj = {
        name: 'main_frame',
        type: 'rect',
        // id: Math.floor((Math.random() * 100) + 1),
        id: Date.now(),
        height: state.height,
        width: state.width,
        z_index: 1,
        color: '#fff',
        image: ''
    }

    const [loader, setLoader] = useState(false);

    const createDesign = async () => {
    const image = await htmlToImage.toBlob(ref.current)
     const design = JSON.stringify(obj)
    if(image){
      const formData = new FormData()
      formData.append('design',design)
      formData.append('image',image)
      try {
        setLoader(true)
         const {data} = await newRequest.post('/create-user-design',formData)
         navigate(`/designs/${data.design._id}/edit`)
         setLoader(false)
      } catch (error) {
        setLoader(false)
        console.log(error.response?.data)
      }
    }
  }

  useEffect(() => {
    if(state && ref.current){
      createDesign()
    }else{
      navigate('/')
    }
  },[state,ref])

  return (
    <>
    {/*
    <div className='w-screen h-screen flex justify-center items-center relative' >
        <div ref={ref} className='relative w-auto h-auto overflow-auto'>
            <CreateComponent info={obj} current_component={{}} />
        </div>
    </div>
    */}
    <div className='px-5 mx-5 w-100 h-100 d-flex justify-content-center align-items-center position-relative' >
        <div ref={ref} className="px-2 mx-5 position-relative overflow-auto">
            <CreateComponent info={obj} current_component={{}} />
        </div>

      {
        loader && 
        <div className='w-100 h-100 left-0 top-0 d-flex justify-content-center align-items-center bg-black position-absolute' >
          <RotateLoader color="white" />
        </div>
      }

    </div>
    </>
  )
}

export default CreateDesign