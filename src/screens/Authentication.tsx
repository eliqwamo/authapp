import React, { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { auth, database, googleProvider } from "../utilis/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { collection, addDoc } from "firebase/firestore";

const Authentication = () => {
  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loginView, setLoginView] = useState(true);

  const navigate = useNavigate();

  const connectWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const login = async () => {
    if (email !== "" && password !== "") {
      await signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          navigate("/dashboard");
        })
        .catch((error) => {
          let errMessage = "";
          console.log(error.message);

          switch (error.message) {
            case "Firebase: Error (auth/invalid-credential).":
              errMessage = "Username not exist";
              break;
            default:
              break;
          }
          toast.error(errMessage);
        });
    } else {
      toast.error("Please provide email and password");
    }
  };

  const signup = async () => {
    if (email !== "" && password !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          addDoc(collection(database, "accounts"), {
            uid: result.user.uid,
            firstName: firstName,
            lastName: lastName,
            avatar:
              "https://static.vecteezy.com/system/resources/previews/004/819/327/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg",
            mobile: mobile,
          }).then((account_created) => {
            navigate("/dashboard");
          });
        })
        .catch((error) => {
          let errMessage = "";
          console.log(error.message);

          switch (error.message) {
            case "Firebase: Error (auth/invalid-credential).":
              errMessage = "Username not exist";
              break;
            default:
              break;
          }
          toast.error(errMessage);
        });
    } else {
      toast.error("Please provide email and password");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            {loginView ? (
              <>
                <h1>Welcome Back</h1>
                <p>Please login to the website</p>
                <input
                  className="form-control"
                  value={email}
                  type="email"
                  onChange={(e) => setEMail(e.target.value)}
                  placeholder="Email address"
                />
                <input
                  className="form-control"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button onClick={login} className="btn btn-info btn-lg">
                  Login
                </button>
                <button
                  onClick={connectWithGoogle}
                  className="btn btn-primary btn-lg"
                >
                  Connect with Google
                </button>
              </>
            ) : (
              <>
                <h1>Welcome Aboard</h1>
                <p>Please signup to the website</p>
                <input
                  className="form-control"
                  value={email}
                  type="email"
                  onChange={(e) => setEMail(e.target.value)}
                  placeholder="Email address"
                />
                <input
                  className="form-control"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />

                <input
                  className="form-control"
                  value={firstName}
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />

                <input
                  className="form-control"
                  value={lastName}
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />

                <input
                  className="form-control"
                  value={mobile}
                  type="tel"
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile"
                />
                <button onClick={signup} className="btn btn-warning btn-lg">
                  Signup
                </button>
              </>
            )}

            <button
              onClick={() => setLoginView(!loginView)}
              className="btn btn-outline-secondary btn-lg"
            >
              Change Authentication
            </button>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
