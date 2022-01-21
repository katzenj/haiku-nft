import React, { useEffect, useState } from "react";
import { useContract } from "wagmi";
import { ethers } from "ethers";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import { useAccordionButton } from "react-bootstrap/AccordionButton";

import Button from "./Button";
import HaikuEdit from "./HaikuEdit";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";

import "./NFTCard.css";

const NFTCard = ({ nftData, signer, unsetNft }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lineData, setLineData] = useState(nftData.lines ? nftData.lines : []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card text="dark" style={{ width: "24rem", borderRadius: "10px" }}>
        <Card.Img
          variant="top"
          src={nftData.image}
          style={{ borderRadius: "10px 10px 0px 0px" }}
        />
        <Card.Body>
          <Card.Title>{nftData.name}</Card.Title>
          <Card.Text>{nftData.description}</Card.Text>
          {/* <Button
            onClick={() => setOpen(!open)}
            aria-controls="edit-haiku-collapse-button"
            aria-expanded={open}
          >
            Edit haiku
          </Button> */}
          <HaikuEdit
            signer={signer}
            lines={nftData.lines}
            tokenId={nftData.tokenId}
          />
          {/*
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Accordion Item #1</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Accordion Item #2</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Collapse in={open}>
            <div id="example-collapse-text">
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. Nihil anim keffiyeh
              helvetica, craft beer labore wes anderson cred nesciunt sapiente
              ea proident.
            </div>
          </Collapse> */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NFTCard;
