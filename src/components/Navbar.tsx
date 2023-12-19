import React, { useState } from "react";

import { database, storage, auth } from "../utilis/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";

const Navbar = () => {
  const [carModel, setCarModel] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carImage, setCarImage] = useState("");

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);




  const addNewCar = () => {
    setIsLoading(true);
    if (carModel !== "" && carPrice !== "" && carImage !== "") {
      //UPLOAD IMAGE TO FB STORAGE
      const storageRef = ref(storage, `gallery/${carImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, carImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            //ADD CAR TO COLLECTION
            addDoc(collection(database, "cars"), {
              createdAt: Date.now(),
              carModel: carModel,
              carPrice: carPrice,
              carImage: downloadURL,
              userUID: auth.currentUser?.uid,
            }).then((task_completed) => {
              toast.success("Car added successfully");
              setCarModel("");
              setCarPrice("");
              setCarImage("");
              //
              setIsLoading(false);
              //loadCars()
            });
          })
          .catch(error => {
            toast.error(error.message);
            setIsLoading(false);
          })
        }
      );
    } else {
      toast.error("All inputs are required");
      setIsLoading(false);
    }
  };

  return (
    <>
    <ToastContainer />
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="/dashboard">
              <img className="logo" src="../../images/logo.png" />
            </a>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Link
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown link
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />

            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Launch demo modal
            </button>
          </div>
        </div>
      </nav>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Upload New Car
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="form-floating">
                <input
                  value={carModel}
                  onChange={(e) => {
                    setCarModel(e.target.value);
                  }}
                  type="text"
                  className="form-control"
                  placeholder="Car model"
                />
                <label>Car model</label>
              </div>

              <div className="form-floating">
                <input
                  type="text"
                  value={carPrice}
                  onChange={(e) => {
                    setCarPrice(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Car price"
                />
                <label>Car price</label>
              </div>

              <div className="form-floating">
                <input
                  type="file"
                  onChange={(e) => {
                    setCarImage(e.target.files[0]);
                  }}
                  className="form-control"
                  placeholder="Car image"
                />
                <label>Car image</label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>




              {
                isLoading ? (<>
                    <div style={{width:'100%', textAlign:'center'}}>
                    <div className="spinner-border text-info" style={{width: '3rem', height: '3rem',}} role="status"></div>
                    <p style={{color:'#000000'}}>Loading... {progress}%</p>
                    </div>
                </>) : (<>
                    <button
                    onClick={addNewCar}
                    type="button"
                    className="btn btn-primary">Save changes</button>
                </>)
              }




            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
