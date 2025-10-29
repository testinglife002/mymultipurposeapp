import React, { useState, useEffect } from 'react';
import newRequest from "../../api/newRequest";
import { useNavigate } from 'react-router-dom';
import './CanvaTemplate.css'; // import your custom CSS

const CanvaTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const getTemplates = async () => {
    try {
      setLoader(true);
      const { data } = await newRequest.get('/templates');
      setTemplates(data.templates || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const add_template = async (id) => {
    try {
      const { data } = await newRequest.get(`/add-user-template/${id}`);
      navigate(`/design/${data.design?._id}/edit`);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="template-container">
      {loader ? (
        <p>Loading templates...</p>
      ) : templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        templates.map((design, i) => (
          <div
            key={design._id}
            onClick={() => add_template(design._id)}
            className="template-card"
          >
            <div className="template-card-inner">
              <img
                src={design.image_url}
                alt="Template"
                className="template-image"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CanvaTemplate