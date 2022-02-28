pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract KoyweCollectibles is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  IERC20 bct;
  uint256 public bctPrice = 2.5 ether; //shorthand for 2.5*10**18
  uint8 public cap = 255;

  constructor(address _tokenAddress) ERC721("KoyweTrees", "KOYTREE") {
    bct = IERC20(_tokenAddress);
  }
  
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => uint256) public leafiness;
  mapping (uint256 => uint256) public location;
  string[] locations = ["Araucania CL","Patagonia CL","Patagonia AR", "BCT Retirement","CentroSur CL"];

  uint256 mintDeadline = block.timestamp + 24 hours;

  function changePrice(uint256 _newPrice) public onlyOwner{
    bctPrice = _newPrice;
  }

  function mintOpen() public view returns(bool) {
    return _tokenIds.current() < cap;
  }
  
  function withdraw() public onlyOwner{
    bct.transfer(msg.sender, bct.balanceOf(address(this)));
  }

  function mintItem()
    public
    returns (uint256)
  {
    require( _tokenIds.current() < cap, "No more trees to sell");
    require(bct.balanceOf(address(msg.sender)) >= bctPrice, "You don't have enough tokens to buy the Tree.");

    _tokenIds.increment();

    uint256 id = _tokenIds.current();
    _mint(msg.sender, id);

    bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this) ));
    color[id] = bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes3(predictableRandom[2]) >> 16 );
    leafiness[id] = 5+((16*uint256(uint8(predictableRandom[3])))/255);
    location[id] = ((4*uint256(uint8(predictableRandom[0])))/255);
    
    bct.transferFrom(msg.sender, address(this), bctPrice);

    return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "Item does not exist");
      string memory name = string(abi.encodePacked('Koywe Tree #',id.toString()));
      string memory description = string(abi.encodePacked('This Tree is the color #',color[id].toColor(),' with a leafiness of ',uint2str(leafiness[id]),', to be planted in ',locations[location[id]],'!'));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));
      string memory nameDescLink = append('{"name":"',name,'", "description":"',description,'", "external_url":"https://www.koywe.eco/alfaktree/');
      string memory idColorTraits = append(id.toString(),'", "attributes": [{"trait_type": "color", "value": "#',color[id].toColor(),'"},{"trait_type": "leafiness", "value": ',uint2str(leafiness[id]));

      return
        string(
          abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(
              bytes(
                  abi.encodePacked(
                    nameDescLink,
                    idColorTraits,
                    '},{"trait_type": "location", "value": "',locations[location[id]],'"}], "owner":"',
                    (uint160(ownerOf(id))).toHexString(20),
                    '", "image": "',
                    'data:image/svg+xml;base64,',
                    image,
                    '"}'
                  )
                )
              )
          )
        );
  }

  function append(string memory a, string memory b, string memory c, string memory d, string memory e) internal pure returns (string memory) {
    return string(abi.encodePacked(a, b, c, d, e));
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="200" height="200" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<g id="tree" stroke="#',color[id].toColor(),'" fill="none">',
        '<path d="M 0 90 A 90 90 0 1 1 40 80.62257748" stroke-width="10"/>',
        '<path d="M 0 90 L 0 -80 M 0 50 L 64.701 -47.0515 M 0 50 L -64.701 -47.0515 M 0 10 L 49.8746 -64.812 M 0 10 L -49.8746 -64.812 M 0 -30 L 29.559 -74.3385 M 0 -30 L -29.559 -74.3385" stroke-width="',uint2str(leafiness[id]),'" />',
      '</g>'
      ));

    return render;
  }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }
}