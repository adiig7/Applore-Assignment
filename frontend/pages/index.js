import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { StoreMetadata } from "./StoreMetadata";
import { useSigner, useProvider, useContract, useAccount } from "wagmi";
import { abi } from "./../constants/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACT_ADDRESS } from "./../constants/constants";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState([]);
  const [price, setPrice] = useState();
  const [ipfsUri, setIpfsUri] = useState("");
  const [ipfs, setIpfs] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");

  const { address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signer || provider,
  });

  const mint = async (ipfsURI) => {
    try {
      const tx = await contract.mintToken(address, ipfsURI);
      await tx.wait();
            const id = parseInt(tx.value._hex);
      alert("Minted successfully!");
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const upload = async () => {
    try {
      const metadata = await StoreMetadata(img, name, description, price);
      const uri = metadata.url;
      setIpfs(`${uri}/metadata.json`);
      const ipfsuri = uri;
      const url = `https://ipfs.io/ipfs/${metadata.ipnft}`;
      const finalUrl = `${url}/metadata.json`;
      setIpfsUrl(finalUrl);
      console.log("NFT metadata uploaded to IPFS:" + url);
      window.alert(
        "NFT metadata uploaded to ipfs , Click on IPFS link to use the data"
      );
      mint(ipfsuri);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Upload metadata on IPFS</title>
        <meta
          name="description"
          content="Create and Upload metadata to IPFS in just a click"
        />
        <link rel="icon" href="/nfticon.png" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <div className={styles.form}>
          <div className={styles.firstrow}>
            <input
              className={styles.input}
              type="text"
              value={name}
              placeholder="Name of the NFT"
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className={styles.secondrow}>
            <input
              className={styles.input}
              type="text"
              value={description}
              placeholder="Description for the NFT"
              onChange={(e) => setDescription(e.target.value)}
            ></input>
          </div>
          <div className={styles.secondrow}>
            <input
              className={styles.input}
              type="number"
              step = "0.01"
              value={price}
              placeholder="Price for the NFT"
              onChange={(e) => setPrice(e.target.value)}
            ></input>
          </div>
          <div className={styles.thirdrow}></div>
          <label className={styles.inputLabel}>
            <input
              className={styles.inputBox}
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            ></input>
          </label>
          <div className={styles.buttonRow}>
            <button onClick={upload} className={styles.button}>
              Mint NFT 
            </button>
            <p> IPFS URL:</p>
            <a href={ ipfsUrl}> {ipfsUrl}</a>
          </div>
        </div>
      </main>
    </div>
  );
}
