import React, { useState } from "react";
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
  PaymasterMode,
} from "@biconomy/account";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { contractABI } from "../contract/contractABI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(
    null
  );
  const [count, setCount] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [chainSelected, setChainSelected] = useState<number>(0);

  const chains = [
    {
      chainId: 11155111,
      name: "Ethereum Sepolia",
      providerUrl: "https://eth-sepolia.public.blastapi.io",
      incrementCountContractAdd: "0xd9ea570eF1378D7B52887cE0342721E164062f5f",
      biconomyPaymasterApiKey: "gJdVIBMSe.f6cc87ea-e351-449d-9736-c04c6fab56a2",
      explorerUrl: "https://sepolia.etherscan.io/tx/",
      ticker: "ETH",
      tickerName: "Ethereum",
      blockExplorer: "https://sepolia.etherscan.io/",
    },
    {
      chainId: 80002,
      name: "Polygon Amoy",
      providerUrl: "https://rpc-amoy.polygon.technology/",
      incrementCountContractAdd: "0xfeec89eC2afD503FF359487967D02285f7DaA9aD",
      biconomyPaymasterApiKey: "TVDdBH-yz.5040805f-d795-4078-9fd1-b668b8817642",
      explorerUrl: "https://www.oklink.com/amoy/tx/",
      ticker: "MATIC",
      tickerName: "Polygon Matic",
      blockExplorer: "https://www.oklink.com/amoy/",
    },
    {
      chainId: 1482601649,
      name: "SKALE Nebula",
      providerUrl: "https://mainnet.skalenodes.com/v1/haunting-devoted-deneb",
      incrementCountContractAdd: "0x0000000000000000000000000000000000000000", // Replace with your contract
      biconomyPaymasterApiKey: "", // Add your key
      explorerUrl:
        "https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com/tx/",
      ticker: "SKL",
      tickerName: "SKALE",
      blockExplorer:
        "https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com/",
    },
    {
      chainId: 421613,
      name: "Arbitrum Sepolia",
      providerUrl: "https://sepolia-rollup.arbitrum.io/rpc",
      incrementCountContractAdd: "0x0000000000000000000000000000000000000000", // Replace with your contract
      biconomyPaymasterApiKey: "", // Add your key
      explorerUrl: "https://sepolia.arbiscan.io/tx/",
      ticker: "ETH",
      tickerName: "Arbitrum ETH",
      blockExplorer: "https://sepolia.arbiscan.io/",
    },
    {
      chainId: 44787,
      name: "Celo Alfajores",
      providerUrl: "https://alfajores-forno.celo-testnet.org",
      incrementCountContractAdd: "0x0000000000000000000000000000000000000000", // Replace with your contract
      biconomyPaymasterApiKey: "", // Add your key
      explorerUrl: "https://alfajores.celoscan.io/tx/",
      ticker: "CELO",
      tickerName: "Celo",
      blockExplorer: "https://alfajores.celoscan.io/",
    },
    // Non-EVM example (not supported by Biconomy/Web3Auth EIP155):
    // {
    //   chainId: "solana",
    //   name: "Solana Devnet",
    //   providerUrl: "https://api.devnet.solana.com",
    //   incrementCountContractAdd: "",
    //   biconomyPaymasterApiKey: "",
    //   explorerUrl: "https://explorer.solana.com/tx/",
    //   ticker: "SOL",
    //   tickerName: "Solana",
    //   blockExplorer: "https://explorer.solana.com/",
    // },
    // {
    //   chainId: "bitcoin",
    //   name: "Bitcoin Testnet",
    //   providerUrl: "https://api.blockcypher.com/v1/btc/test3",
    //   incrementCountContractAdd: "",
    //   biconomyPaymasterApiKey: "",
    //   explorerUrl: "https://live.blockcypher.com/btc-testnet/tx/",
    //   ticker: "BTC",
    //   tickerName: "Bitcoin",
    //   blockExplorer: "https://live.blockcypher.com/btc-testnet/",
    // },
  ];

  const connect = async () => {
    try {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: `0x${chains[chainSelected].chainId.toString(16)}`,
        rpcTarget: chains[chainSelected].providerUrl,
        displayName: chains[chainSelected].name,
        blockExplorer: chains[chainSelected].blockExplorer,
        ticker: chains[chainSelected].ticker,
        tickerName: chains[chainSelected].tickerName,
      };

      //Creating web3auth instance
      const web3auth = new Web3Auth({
        clientId:
          "BPOUdMclUNO5Po-w0YQi0ofUDhYB6pBgtR37s8rIbXJZMkHe7-z8sdvnrc37YaM0VoI5t9A3eByUuf2TA4LU6Gs", // Get your Client ID from the Web3Auth Dashboard https://dashboard.web3auth.io/
        web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
        chainConfig,
        uiConfig: {
          appName: "Biconomy X Web3Auth",
          mode: "dark", // light, dark or auto
          loginMethodsOrder: ["apple", "google", "twitter"],
          logoLight: "https://web3auth.io/images/web3auth-logo.svg",
          logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
          defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          loginGridCol: 3,
          primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
        },
      } as any);

      await web3auth.init();
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider as any
      );
      const web3AuthSigner = ethersProvider.getSigner();

      const config = {
        biconomyPaymasterApiKey: chains[chainSelected].biconomyPaymasterApiKey,
        bundlerUrl: `https://bundler.biconomy.io/api/v3/${chains[chainSelected].chainId}/bundler_Cp88SmXrQbAhSSChjpNVJJ`, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
      };

      const smartWallet = await createSmartAccountClient({
        signer: web3AuthSigner,
        biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        bundlerUrl: config.bundlerUrl,
        rpcUrl: chains[chainSelected].providerUrl,
        chainId: chains[chainSelected].chainId,
      });

      console.log("Biconomy Smart Account", smartWallet);
      setSmartAccount(smartWallet);
      const saAddress = await smartWallet.getAccountAddress();
      console.log("Smart Account Address", saAddress);
      setSmartAccountAddress(saAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const getCountId = async () => {
    const contractAddress = chains[chainSelected].incrementCountContractAdd;
    const provider = new ethers.providers.JsonRpcProvider(
      chains[chainSelected].providerUrl
    );
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const countId = await contractInstance.getCount();
    setCount(countId.toString());
  };

  const incrementCount = async () => {
    try {
      const toastId = toast("Populating Transaction", { autoClose: false });

      const contractAddress = chains[chainSelected].incrementCountContractAdd;
      const provider = new ethers.providers.JsonRpcProvider(
        chains[chainSelected].providerUrl
      );
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const minTx = await contractInstance.populateTransaction.increment();
      console.log("Mint Tx Data", minTx.data);
      const tx1 = {
        to: contractAddress,
        data: minTx.data,
      };

      toast.update(toastId, {
        render: "Sending Transaction",
        autoClose: false,
      });
      //@ts-ignore
      const userOpResponse = await smartAccount?.sendTransaction(tx1, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });
      //@ts-ignore
      const { transactionHash } = await userOpResponse.waitForTxHash();
      console.log("Transaction Hash", transactionHash);

      if (transactionHash) {
        toast.update(toastId, {
          render: "Transaction Successful",
          type: "success",
          autoClose: 5000,
        });
        setTxnHash(transactionHash);
        await getCountId();
      }
    } catch (error) {
      console.log(error);
      toast.error("Transaction Unsuccessful", { autoClose: 5000 });
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-white via-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 mt-8">
        <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-2">
          Biconomy + Web3Auth Demo
        </h1>
        <p className="text-center text-slate-500 mb-4">
          A simple, gasless smart account dApp using modern web3 infra.
        </p>

        {/* Network Selector */}
        <div className="flex flex-col items-center mb-2">
          <label
            htmlFor="network-select"
            className="text-sm text-slate-600 mb-1 font-medium"
          >
            Select Network
          </label>
          <select
            id="network-select"
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={chainSelected}
            onChange={(e) => setChainSelected(Number(e.target.value))}
            disabled={!!smartAccount}
          >
            {chains.map((chain, idx) => (
              <option key={chain.chainId} value={idx}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Connect or Account Info */}
        {!smartAccount ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-lg shadow transition-all"
              onClick={connect}
            >
              Connect with Web3Auth
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2 border border-slate-200">
              <div className="text-xs text-slate-500">
                Smart Account Address
              </div>
              <div className="font-mono text-slate-700 break-all text-sm">
                {smartAccountAddress}
              </div>
              <div className="text-xs text-slate-500 mt-2">Network</div>
              <div className="font-semibold text-orange-500">
                {chains[chainSelected].name}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-center gap-2">
                <button
                  className="w-full py-2 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-lg shadow transition-all"
                  onClick={getCountId}
                >
                  Get Count
                </button>
                <div className="text-lg font-mono text-slate-700 min-h-[1.5rem]">
                  {count !== null ? count : "-"}
                </div>
              </div>
              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-center gap-2">
                <button
                  className="w-full py-2 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-lg shadow transition-all"
                  onClick={incrementCount}
                >
                  Increment Count
                </button>
                {txnHash && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${chains[chainSelected].explorerUrl + txnHash}`}
                    className="text-orange-500 font-semibold underline text-sm mt-2"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center mt-2">
              Open browser console for logs and troubleshooting info.
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-xs text-slate-400 text-center">
        Demo dApp &copy; {new Date().getFullYear()} | Powered by Biconomy &
        Web3Auth
      </footer>
    </main>
  );
}
