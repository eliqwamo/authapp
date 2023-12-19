import React, { useEffect, useState } from "react";
import { auth, database } from "../utilis/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = async () => {
    auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    loadAccount();
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

  return (
    <>





      <Navbar />


      <button onClick={logout} className="btn btn-danger btn-lg">
        Logout
      </button>
    </>
  );
};

export default Dashboard;
