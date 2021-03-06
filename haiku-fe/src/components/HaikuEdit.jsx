import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useContract } from "wagmi";
import { HexColorPicker, HexColorInput } from "react-colorful";

import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";

import "./HaikuEdit.css";

const ABI = abi.abi;

const EditColor = ({ title, color, setColor }) => {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <p className="edit-color">
        <b>{title}:</b> {color}
        <button className="edit-button" onClick={() => setEditing(!editing)}>
          <i className="far fa-edit"></i>
        </button>
      </p>
      {editing ? (
        <div className="color-picker-container">
          <div className="color-picker-thing">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
          <div className="color-picker-input">
            <HexColorInput color={color} onChange={setColor} />
          </div>
        </div>
      ) : null}
    </>
  );
};

const HaikuEdit = ({ signer, lines, onSubmit, tokenId }) => {
  const [loading, setLoading] = useState(false);
  const [fontColor, setFontColor] = useState("#fff");
  const [bgColor, setBgColor] = useState("#000");

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: signer,
  });

  const maybeUpdate = async (tokenId) => {
    try {
      setLoading(true);
      const txn = await contract.updatePoem(
        ethers.BigNumber.from(tokenId),
        bgColor,
        fontColor,
        { gasLimit: 900000 }
      );
      console.log("mining --- ", txn);
      await txn.wait();
      console.log("mined --- ", txn);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <>
      <EditColor
        title="Background color"
        color={bgColor}
        setColor={setBgColor}
      />
      <EditColor title="Font color" color={fontColor} setColor={setFontColor} />
      <Button onClick={() => maybeUpdate(tokenId)}>
        {loading ? <div className="loading"></div> : "Update"}
      </Button>
    </>
  );
};

export default HaikuEdit;
