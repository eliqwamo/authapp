import React, { useEffect, useState } from "react";
import { auth, database, storage } from "../utilis/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  addDoc,
  doc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import CarItem from "../components/CarItem";



const Dashboard = () => {


  const [carModel, setCarModel] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carImage, setCarImage] = useState("");

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState('12');

  const months = [
    {name: '12', value: '12'},
    {name: '24', value: '24'},
    {name: '36', value: '36'},
    {name: '48', value: '48'},
    {name: '60', value: '60'},
  ]

  const [selectedValue, setSelectedValue] = useState(0);
  const [minValue, setMinValue] = useState(selectedCar ? (selectedCar.carPrice * 10) / 100 : 0);
  const [maxValue, setMaxValue] = useState(selectedCar? selectedCar.carPrice : 0);





  const navigate = useNavigate();
  const logout = async () => {
    auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    loadAccount();
    loadCars();
  }, []);

  const loadAccount = async () => {
    const accountsRef = collection(database, "accounts");
    const q = query(accountsRef, where("uid", "==", auth.currentUser?.uid));
    const qSnapShot = await getDocs(q);
    const array = qSnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(JSON.stringify(array[0]));
  };


  const loadCars = () => {
    setIsLoading(true)
    getDocs(collection(database, "cars"))
    .then(results => {
      setCars(results.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })))
      setIsLoading(false)
    })
    .catch(error => {
      setIsLoading(false)
      toast.error(error.message)
    })
  }

 

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
              loadCars()
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


  function formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
  }



  return (
    <>
      <Navbar />


      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3">
            <h4>Cars Market</h4><br/>

            <div className='container-fluid'>
            {
              cars.length > 0 ? (<>
                {
                  cars.map((car) => (
                    <CarItem car={car} clickCar={() => {setSelectedCar(car)}} />
                  ))
                }
              </>) : (<>
                <p style={{color:'#ffffff'}}>Please upload car</p>
              </>)
            }
                        <button
              type="button"
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Launch demo modal
            </button>
            </div>


          </div>
          <div className="col-lg-6">
            <h4>Selected Car</h4><br/>

            {
              selectedCar ? (<>
                <img src={selectedCar.carImage} style={{width:'100%'}} /><br/>
                <h4>{selectedCar.carModel}</h4>
                <p className="price">${formatNumber(selectedCar.carPrice)}</p>
              </>) : (<>
                <p style={{color:'#ffffff'}}>Please select your car from the left column</p>
              </>)
            }


          </div>
          <div className="col-lg-3">
            <h4>Lease Calculator</h4><br/>

            <p style={{color:'#ffffff'}}>Select first payment</p>
            <input 
              value={selectedValue}
              min={minValue}
              max={maxValue}
              onChange={(e) => {setSelectedValue(e.target.value)}}
              type="range" 
              className="form-range" 
             />
             <h5>${selectedValue}</h5><br/>

             <p style={{color:'#ffffff'}}>Select number of months</p>

             <div className="btn-group" role="group" aria-label="Basic radio toggle button group">

              {
                months.map((month, idx) => (
                  <>
                  <input 
                    key={idx}
                    id={`month-${idx}`}
                    onChange={(e) => setSelectedMonths(e.currentTarget.value)} 
                    type="radio" className="btn-check" 
                    value={month.value}
                    checked={selectedMonths === month.value}
                    name="month" />
                  <label className="btn btn-outline-primary">{month.name}</label>
                  </>
                ))
              }
              <div style={{width:'100%', marginTop:12}}>
              <h5>{selectedMonths}</h5></div>

            </div>

          </div>
        </div>
      </div>







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
                className="btn btn-danger"
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
                    className="btn btn-success">Save changes</button>
                </>)
              }




            </div>
          </div>
        </div>
      </div>



      <ToastContainer />

      <button onClick={logout} className="btn btn-danger btn-lg">
        Logout
      </button>
    </>
  );
};

export default Dashboard;
