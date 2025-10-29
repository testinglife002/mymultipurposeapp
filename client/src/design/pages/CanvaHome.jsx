import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./CanvaHome.css";

const CanvaHome = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({ width: "", height: "" });
  const [show, setShow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const chunkArray = (arr, size) =>
    arr.reduce((chunks, item, i) => {
      if (i % size === 0) chunks.push([]);
      chunks[chunks.length - 1].push(item);
      return chunks;
    }, []);

  const slides = chunkArray(designs, 4);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const create = (e) => {
    e.preventDefault();
    navigate("/designs/design/create", {
      state: { type: "create", width: state.width, height: state.height },
       replace: true,
    });
  };

  const getUserDesigns = async () => {
    try {
      setLoader(true);
      const { data } = await newRequest.get("/user-designs");
      setDesigns(data.designs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const deleteDesign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    try {
      await newRequest.delete(`/delete-user-image/${id}`);
      getUserDesigns();
    } catch (error) {
      console.error(error);
      alert("Failed to delete design");
    }
  };

  useEffect(() => {
    getUserDesigns();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <button className="custom-btn" onClick={() => setShow(!show)}>
          Custom Size
        </button>

        {show && (
          <div className="custom-popup">
            <form onSubmit={create}>
              <div className="input-row">
                <div className="input-group">
                  <label>Width</label>
                  <input
                    type="number"
                    name="width"
                    placeholder="Width"
                    onChange={inputHandle}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Height</label>
                  <input
                    type="number"
                    name="height"
                    placeholder="Height"
                    onChange={inputHandle}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">
                <Plus size={16} />
                Create New Design
              </button>
            </form>
          </div>
        )}

        <h2 className="hero-title">What will you design today?</h2>
      </div>

      {/* Designs Section */}
      <h4 className="section-title">Your recent designs</h4>

      {loader ? (
        <div className="loader"></div>
      ) : designs.length === 0 ? (
        <p className="empty-text">No designs found.</p>
      ) : (
        <div className="carousel">
          <button className="nav-btn prev" onClick={prevSlide}>
            ‹
          </button>
          <div className="carousel-track">
            {slides.map((group, i) => (
              <div
                key={i}
                className={`carousel-slide ${
                  i === currentSlide ? "active" : ""
                }`}
              >
                {group.map((d, j) => (
                  <div className="design-card" key={j}>
                    <Link to={`/design/${d._id}/edit`}>
                      <img
                        src={d.image_url}
                        alt="User Design"
                        className="design-img"
                      />
                    </Link>
                    <button
                      className="delete-icon"
                      onClick={() => deleteDesign(d._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="nav-btn next" onClick={nextSlide}>
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default CanvaHome