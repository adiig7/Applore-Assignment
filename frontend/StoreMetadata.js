import {
    NFTStorage
} from "nft.storage";
import { NFT_STORAGE_API_KEY } from "./constants/constants.js";


export const StoreMetadata = async (image, Name, Description, Price) => {
    // In case you are using env then uncomment this 
    console.log("Preparing Metadata ....");
    const nft = {
        image: image,
        name: Name,
        description: Description,
        price: Price
    };
    console.log("Uploading Metadata to IPFS ....");
    const client = new NFTStorage({
        token: NFT_STORAGE_API_KEY
    });
    const metadata = await client.store(nft);
    console.log(metadata);
    console.log("NFT data stored successfully 🚀🚀");
    console.log("Metadata URI: ", metadata.url);

    return metadata;
};
