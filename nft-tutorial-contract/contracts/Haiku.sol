//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

// We need some util functions for strings.
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(input, 0x3F))), 0xFF)
                )
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}

contract Haiku is ERC721Enumerable, ERC721URIStorage, Ownable  {
  using Counters for Counters.Counter;
  using Strings for uint256;

  Counters.Counter private _tokenIds;

  uint256 public constant MAX_PER_WALLET = 2;
  uint256 public constant PUBLIC_SALE_PRICE = 0.05 ether;
  uint256 public maxHaikus;
  bool public isPublicSaleActive;

  mapping(uint256 => string) private tokenIdToHaikuSvg;

  // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
  // So, we make a baseSvg variable here that all our NFTs can use.
  string private constant baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='#55849f' /><text x='50%' y='25%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  event NFTMinted(address indexed to, uint256 timestamp, uint256 tokenId);
  event HaikuUpdated(address indexed owner, uint256 timestamp, uint256 tokenId);

  constructor(uint256 _maxHaikus) ERC721 ("Haiku", "HAIKU") {
    maxHaikus = _maxHaikus;
    isPublicSaleActive = true;  // Change for mainnet.
  }

  // ============ ACCESS CONTROL/SANITY MODIFIERS ============

  modifier ownsToken(uint256 tokenId) {
    require(
        _isApprovedOrOwner(msg.sender, tokenId),
        "You can't edit a poem you don't own..."
    );
    _;
  }

  modifier maxHaikusPerWallet(uint256 numberOfTokens) {
    require(
        balanceOf(msg.sender) + numberOfTokens <= MAX_PER_WALLET,
        "Max haikus to mint is two"
    );
    _;
  }

  modifier publicSaleActive() {
    require(isPublicSaleActive, "Public sale is not open");
    _;
  }

  modifier canMintHaiku(uint256 numberOfTokens) {
    require(
      _tokenIds.current() + numberOfTokens <= maxHaikus,
      "Not enough haikus remaining to mint"
    );
    _;
  }

  modifier isCorrectPayment(uint256 numberOfTokens) {
    require(
      PUBLIC_SALE_PRICE * numberOfTokens == msg.value,
      "Incorrect ETH value sent"
    );
    _;
  }

  modifier isValidHexColor(bytes memory color) {
    require(color.length < 8 && color.length > 3, "must be a valid hex color");
    bool valid = isValidColor(color);
    require(valid == true, "invalid hex color");
    _;
  }

  // ============ PRIVATE HELPERS ============
  function _getJsonBase(uint256 tokenId) pure private returns (bytes memory) {
    return abi.encodePacked('{"name": "Haiku #', Strings.toString(tokenId), '", "description": "Your haiku", "image": "data:image/svg+xml;base64,');
  }

  function isValidColor(bytes memory color) pure private returns (bool) {
    for(uint i; i < color.length; i++){
      uint8 c = uint8(color[i]);
      if (i == 0 && uint8(c) != 35) {
        return false;
      } else if (i >= 1) {
        bool valid = (
          (c >= 48 && c <= 57) || // between 0-9
          (c >= 65 && c <= 90) || // between A-Z
          (c >= 97 && c <= 122) // between a-z
        );
        if (!valid) {
          return false;
        }
      }
    }
    return true;
  }

  // ============ PUBLIC MINT/MODIFY FUNCTIONS ============
  function mint()
    external
  {
    uint256 newItemId = _tokenIds.current();

    string memory svgText = '<tspan x="50%" dy="0em">snow coats the window</tspan><tspan x="50%" dy="1.1em">flakes blow across the rooftop</tspan><tspan x="50%" dy="1.1em">oh how cold it is</tspan>';
    bytes memory finalSvg = abi.encodePacked(baseSvg, svgText,"</text></svg>");
    string memory json = Base64.encode(
      abi.encodePacked(
        _getJsonBase(newItemId),
        Base64.encode(finalSvg),
        '"}'
      )
    );
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, finalTokenUri);

    tokenIdToHaikuSvg[newItemId] = svgText;

    _tokenIds.increment();

    emit NFTMinted(msg.sender, block.timestamp, newItemId);
  }

  function updatePoem(
    uint256 tokenId,
    string calldata bgColor,
    string calldata fontColor
  )
    external
    ownsToken(tokenId)
    isValidHexColor(bytes(bgColor))
    isValidHexColor(bytes(fontColor))
  {
    string memory json;
    {
      string memory colorSvgBase = string(
        abi.encodePacked(
          "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: ",
          fontColor,
          "; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill=\"",
          bgColor,
          "\" /><text x='50%' y='25%' class='base' dominant-baseline='middle' text-anchor='middle'>"
        )
      );
      string memory svgText = tokenIdToHaikuSvg[tokenId];
      bytes memory finalSvg = abi.encodePacked(colorSvgBase, svgText,"</text></svg>");

      json = Base64.encode(
        abi.encodePacked(
          _getJsonBase(tokenId),
          Base64.encode(finalSvg),
          '"}'
        )
      );
    }
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    _setTokenURI(tokenId, finalTokenUri);
    emit HaikuUpdated(msg.sender, block.timestamp, tokenId);
  }

  // ============ PRIVATE ADMIN-ONLY FUNCTIONS ============
  function setIsPublicSaleActive(bool _isPublicSaleActive)
    external
    onlyOwner
  {
    isPublicSaleActive = _isPublicSaleActive;
  }

  // ============ REQUIRED OVERRIDES ============
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
  {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
