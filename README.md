# Biconomy-Web3Auth Integration with Next.js

This is a [Next.js](https://nextjs.org/) project that demonstrates the integration of Biconomy for gasless transactions and Web3Auth for user authentication. It allows you to interact with a smart contract on the Polygon Mumbai test network.

## Getting Started

To get started with this project, follow these steps:

1. **Clone this repository to your local machine:**

   ```bash
   git clone https://github.com/peter-mwau/biconomy_web3auth_example.git
   cd biconomy_web3auth_example
   ```

2. **Install the project dependencies:**

   ```bash
   npm install
   # or
   yarn
   ```

3. **Configure Biconomy and Web3Auth:**

   - **Biconomy:**

     1. Go to the [Biconomy Dashboard](https://dashboard.biconomy.io/).
     2. Create an account or log in.
     3. Create a new project and add your smart contract.
     4. In your project, navigate to the **Bundler** section to get your **Bundler URL**.
     5. Go to the **Paymaster** section to get your **Biconomy API Key**.
     6. Use these values in your code/configuration where required (see `src/pages/index.tsx`).

   - **Web3Auth:**
     1. Go to the [Web3Auth Dashboard](https://dashboard.web3auth.io/).
     2. Create an account or log in.
     3. Create a new project.
     4. In your project settings, you will find your **Client ID** and network configuration details.
     5. Use these values in your code/configuration where required (see `src/pages/index.tsx`).

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your web browser to access the application.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Technologies Used

- [Next.js](https://nextjs.org/): A React framework for building web applications.
- [Biconomy](https://www.biconomy.io/): A gas-free transaction infrastructure for Ethereum and other blockchains.
- [Web3Auth](https://web3auth.io/): An easy-to-integrate solution for wallet-based authentication in decentralized applications.
- [Ethers.js](https://docs.ethers.org/v5/): A library for interacting with the Ethereum blockchain.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs): Learn about Next.js features and API.
- [Biconomy Documentation](https://docs.biconomy.io/): Explore Biconomy's capabilities and integration guides.
- [Web3Auth Documentation](https://web3auth.io/docs): Learn about integrating Web3Auth for seamless user authentication.
- [Ethers.js Documentation](https://docs.ethers.org/v5/): Explore the features and capabilities of Ethers.js.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
