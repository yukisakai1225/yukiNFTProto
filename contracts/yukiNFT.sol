// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract yukiNFT is Context, ERC721Enumerable, Ownable {
    using Strings for uint256;

    // constructor() ERC721(string("Yuki NFT Proto"), string("YukiNFT")) {}

    constructor() ERC721("YukiNFTProto", "YNFT") {}

    function totalSupplyWrapped() public view returns (uint256) {
        console.log("totalSupplyWrapped called");
        return totalSupply();
    }

    function mint(address to) public virtual {
        uint256 supplied = totalSupply();
        console.log("totalSupply before mint", supplied);

        _mint(to, supplied);
        uint256 supplied2 = totalSupply();
        console.log("totalSupply after mint", supplied2);

        // _addTokenToAllTokensEnumeration(supplied2-1);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "https://storage.cloud.google.com/yuki-nft-json/",
                    tokenId.toString(),
                    ".json"
                )
            );
    }
}
