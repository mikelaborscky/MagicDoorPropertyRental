import express from 'express';
import { JsonRpcProvider, Contract } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

import { contractAddress } from './contract-address.js';
import { contractAbi } from './contract-abi.js';

// Configure dotenv to find the .env file in the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

const rpcUrl = process.env.BNB_TESTNET_RPC_URL;
if (!rpcUrl) throw new Error("BNB_TESTNET_RPC_URL not found in .env file");
const provider = new JsonRpcProvider(rpcUrl);
const contract = new Contract(contractAddress, contractAbi, provider);

app.get('/api/get-contract-info', async (req, res) => {
  try {
    // Changed getInfo() to getAvailableProperties() which exists in the ABI
    const rawProperties = await contract.getAvailableProperties();

    // Manually map the contract's response to a clean JSON object
    // This solves the BigInt serialization issue with res.json()
    const properties = rawProperties.map(p => {
      return {
        owner: p.owner,
        details: p.details,
        // Convert BigInt to string for JSON compatibility
        pricePerDay: p.pricePerDay.toString(),
        isAvailable: p.isAvailable
      }
    });

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  const url = `http://localhost:${port}/api/get-contract-info`;
  console.log(`Server listening on port ${port}.`);
  console.log(`API available at: ${url}`);
  // Automatically open the browser to the API endpoint
  open(url);
});