import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useContract } from "wagmi";
import Form from "react-bootstrap/Form";

import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";

const ABI = abi.abi;

const HaikuEdit = ({ signer, lines, onSubmit, tokenId }) => {
  const [lineOne, setLineOne] = useState("");
  const [lineTwo, setLineTwo] = useState("");
  const [lineThree, setLineThree] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    setLineOne(lines[0]);
    setLineTwo(lines[1]);
    setLineThree(lines[2]);
  }, []);

  const validate = () => {
    return true;
  };

  const maybeUpdate = async (tokenId) => {
    try {
      setLoading(true);
      const dataToSend = [lineOne, lineTwo, lineThree];
      validate();
      const txn = await contract.updatePoem(
        ethers.BigNumber.from(tokenId),
        dataToSend,
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
      <Form>
        <Form.Control
          id="inlineFormInputName"
          placeholder="Line 1"
          style={{ borderRadius: "10px", marginBottom: "4px" }}
          value={lineOne}
          onChange={(event) => setLineOne(event.target.value)}
        />
        <Form.Control
          id="inlineFormInputName"
          placeholder="Line 2"
          style={{ borderRadius: "10px", marginBottom: "4px" }}
          value={lineTwo}
          onChange={(event) => setLineTwo(event.target.value)}
        />
        <Form.Control
          id="inlineFormInputName"
          placeholder="Line 2"
          style={{ borderRadius: "10px", marginBottom: "4px" }}
          value={lineThree}
          onChange={(event) => setLineThree(event.target.value)}
        />
      </Form>
      <Button onClick={() => maybeUpdate(tokenId)}>
        {loading ? <div className="loading"></div> : "Update"}
      </Button>
    </>
  );
};

export default HaikuEdit;
