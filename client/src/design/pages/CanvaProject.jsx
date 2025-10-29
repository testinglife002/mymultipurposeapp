import React from 'react';
import { Link } from 'react-router-dom';
import './CanvaProject.css'; // custom CSS file
import { useState } from 'react';
import { useEffect } from 'react';
import newRequest from "../../api/newRequest";
import ItemAlt from '../comopnents/ItemAlt';


const CanvaProject = () => {
  const [designs, setDesigns] = useState([]);
    const [loader, setLoader] = useState(false);

    const getUserDesigns = async () => {
        try {
        setLoader(true);
        const { data } = await newRequest.get('/user-designs');
        setDesigns(data.designs || []);
        } catch (error) {
        console.error(error);
        } finally {
        setLoader(false);
        }
    };

    useEffect(() => {    
        getUserDesigns();
      }, []);

      

    const delete_design = async (design_id) => {
        try {
        if (!window.confirm("Are you sure you want to delete this design?")) return;

        const { data } = await newRequest.delete(`/delete-user-image/${design_id}`);
        console.log(data.message);
        
        getUserDesigns(); 
        } catch (error) {
        console.error(error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Something went wrong!");
        }
    };

  return (
    <div className="projects-container" style={{marginTop:'60px', width:'900px'}}>
      <div className="w-100 projects-grid">
        {designs.map((d, i) => (
         // d._id !== design_id &&
          <ItemAlt design={d} key={i} delete_design={delete_design} />
        ))}
      </div>
    </div>
  );
}

export default CanvaProject