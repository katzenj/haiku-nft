import React, { useState } from "react";
import { ethers } from "ethers";
import { useProvider } from "wagmi";

import Button from "./Button";
import TextInput from "./TextInput";

const AddressContainer = ({ setAddressInfo }) => {
  const [addr, setAddr] = useState("");
  const provider = useProvider();

  const submitAddress = async () => {
    const isAddress = ethers.utils.isAddress(addr);
    if (!isAddress) {
      return;
    }

    let ens;
    try {
      ens = await provider.resolveName(add);
    } catch (e) {
      console.error(e);
      ens = null;
    }

    setAddressInfo({ address: add, name: ens });
  };

  return (
    <div>
      <TextInput
        value={addr}
        setValue={setAddr}
        placeholder="woof.eth"
        labelText="Enter address"
      />
      <Button onClick={() => submitAddress()}>Use address</Button>
    </div>
  );
};

export default AddressContainer;
