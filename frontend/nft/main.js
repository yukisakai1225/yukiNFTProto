import yukiNftContract from "../../artifacts/contracts/yukiNFT.sol/yukiNFT.json" assert { type: "json" };

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

//Ganacheのデフォルトのポート番号は8545
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// check metamask
// https://docs.metamask.io/guide/getting-started.html#basic-considerations
if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask is installed!");
}

// 自分のアカウント情報を取得
const accounts = await ethereum.request({ method: "eth_requestAccounts" });
const account = accounts[0];
web3.eth.defaultAccount = account;

const contract = new web3.eth.Contract(yukiNftContract.abi, contractAddress);

// 初期表示
displayNFT();

// mintButton
$("#mintButton").click(async function () {
  await mint();
});

// mintButton
$("#transferButton").click(async function () {
  const from = web3.eth.defaultAccount;
  const to = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
  const tokenId = 1;
  await approveAndTransfer(from, to, tokenId);
});

// fetchTotalSupply
$("#refreshButton").click(async function () {
  const totalSupply = await getTotalSupply();
  console.log(`totalSupply : ${totalSupply}`);
  $(".totalSupply").replaceWith(
    // "<ul class='list-group rounded-0'>" + todoHTMLItems + "</ul>"
    `<div class='totalSupply'>totalSupply : ${totalSupply}</div>`
  );
  displayNFT();
});

// TODOリストの表示
async function displayNFT() {
  const totalSupply = await getTotalSupply();
  const tokenIds = [];
  for (let i = 0; i < totalSupply; i++) {
    tokenIds.push(i);
  }

  const owners = await Promise.all(
    tokenIds.map((tokenId) => getOwnerAddress(tokenId))
  );

  const jsonURLs = await Promise.all(
    tokenIds.map((tokenId) => getJsonURL(tokenId))
  );

  // const values = await Promise.all(nftList);
  _updateDisplay(tokenIds, owners, jsonURLs);
}

async function getJsonURL(tokenId) {
  return await getTokenURI(tokenId);
}

// TODOリストの表示更新
function _updateDisplay(tokenIds, owners, jsonURLs) {
  // 表示する HTML を生成
  let todoHTMLItems = "";
  tokenIds.forEach((tokenId) => {
    const content = `${tokenId}, ${owners[tokenId]}, ${jsonURLs[tokenId]}`;

    todoHTMLItems =
      todoHTMLItems +
      '<li id="' +
      tokenId +
      '" class="list-group-item border-0 d-flex align-items-center ps-0">' +
      content +
      "</li>";
  });

  // 画面の更新
  $(".list-group").replaceWith(
    "<ul class='list-group rounded-0'>" + todoHTMLItems + "</ul>"
  );
}

// Approval
// {
//   "anonymous": false,
//   "inputs": [
//     {
//       "indexed": true,
//       "internalType": "address",
//       "name": "owner",
//       "type": "address"
//     },
//     {
//       "indexed": true,
//       "internalType": "address",
//       "name": "approved",
//       "type": "address"
//     },
//     {
//       "indexed": true,
//       "internalType": "uint256",
//       "name": "tokenId",
//       "type": "uint256"
//     }
//   ],
//   "name": "Approval",
//   "type": "event"
// },

async function approveAndTransfer(from, to, tokenId) {
  await approve(to, tokenId);
  await safeTransferFrom(from, to, tokenId);
}

async function approve(to, tokenId) {
  return await contract.methods
    .approve(to, tokenId)
    .send({ from: web3.eth.defaultAccount });
}

async function safeTransferFrom(from, to, tokenId) {
  return await contract.methods
    .safeTransferFrom(from, to, tokenId)
    .send({ from: web3.eth.defaultAccount });
}

async function getTokenURI(tokenId) {
  return await contract.methods.tokenURI(tokenId).call();
}

async function getTotalSupply() {
  return await contract.methods.totalSupply().call();
}

async function getOwnerAddress(tokenId) {
  return await contract.methods
    .ownerOf(tokenId)
    .call({ from: web3.eth.defaultAccount });
}

async function mint() {
  await contract.methods
    .mint(web3.eth.defaultAccount)
    .send({ from: web3.eth.defaultAccount });
  displayNFT();
}
