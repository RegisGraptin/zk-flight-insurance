// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FlightInsurance is ERC721 {
    
    address immutable USDC;
    uint256 immutable SCALED_USDC = 1e6;

    uint256 constant PREMIUM_BETWEEN_30_AND_60_MINUTES = 30 * 1e6;
    uint256 constant PREMIUM_BETWEEN_60_AND_120_MINUTES = 50 * 1e6;
    uint256 constant PREMIUM_OVER_120_MINUTES_OR_CANCELLED = 100 * 1e6;

    enum Status { Active, Claimed }

    enum Premium {
        LESS_THAN_30_MINUTES,          // 0
        BETWEEN_30_AND_60_MINUTES,     // 30,
        BETWEEN_60_AND_120_MINUTES,    // 50,
        OVER_120_MINUTES_OR_CANCELLED  // 100
    }


    struct Insurance {
        uint256 price;
        uint256 subscriptionDate;
        Status status;
        // TODO: Should we had the proof for claimed verification? 
    }

    uint256 private _tokenIds;
    mapping(uint256 => Insurance) public insurances;

    constructor(address _usdc) ERC721("FlightInsurance", "FLI") {
        USDC = _usdc;
    }

    /// @notice Verify the user using ZK-Passport
    function verify() public {
        // TODO:
    }

    /// @notice Buy a new insurance
    function buy(
        uint256 price  // TODO: Should match the decimals !
    ) public {
        // TODO: Verify the proof of the plane ticket
        // TODO: Verify user register

        // Pay the assurance
        IERC20(USDC).transferFrom(msg.sender, address(this), price);

        // Create a new insurance
        uint256 tokenId = _tokenIds;
        _mint(msg.sender, tokenId);

        insurances[tokenId] = Insurance({
            price: price,
            subscriptionDate: block.timestamp,
            status: Status.Active
        });

        // Increment the token ID
        _tokenIds++;

        // TODO: Emit event
    }

    /// @notice Claim flight reward
    function claim(
        uint256 insuranceId,
        Premium premium
    ) public {
        require(msg.sender == ownerOf(insuranceId), "NOT_OWNER");
        require(insurances[insuranceId].status == Status.Active, "NOT_ACTIVE");
        require(premium != Premium.LESS_THAN_30_MINUTES, "NOT_PAID");

        // TODO: Need to verify the ZK proof associated

        // Update the insurance state
        insurances[insuranceId].status = Status.Claimed;

        // Send the token to the user
        uint256 premiumValue = 0;
        if (premium == Premium.BETWEEN_30_AND_60_MINUTES) {
            premiumValue = PREMIUM_BETWEEN_30_AND_60_MINUTES;
        } else if (premium == Premium.BETWEEN_60_AND_120_MINUTES) {
            premiumValue = PREMIUM_BETWEEN_60_AND_120_MINUTES;
        } else if (premium == Premium.OVER_120_MINUTES_OR_CANCELLED) {
            premiumValue = PREMIUM_OVER_120_MINUTES_OR_CANCELLED;
        }
        IERC20(USDC).transfer(msg.sender, premiumValue);

        // TODO: Emit event
    }

}
