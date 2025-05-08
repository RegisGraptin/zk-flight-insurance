<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/RegisGraptin/zk-flight-insurance">
    <img src="./logo.jpeg" alt="Logo" width="250" height="250">
  </a>

<h3 align="center">ZK-Flight</h3>
<p align="center" style="font-style: italic; font-size: 1.2em;">Built during <a href="https://www.noirhack.com/">NoirHack 2025</a></p>
  <p align="center">
    Privacy-Preserving On-Chain Flight Insurance
    <br />
    <br />
    <a href="https://github.com/RegisGraptin/zk-flight-insurance">Code</a>
    &middot;
    <a href="#">View Demo</a>
    &middot;
    <a href="#">Video Presentation</a>
    
  </p>
</div>


On-chain insurance enables clear, programmable rules and decentralized management. However, current implementations suffer from a critical flaw: lack of privacy. Anyone can observe insurance purchases and infer user habits.

ZK-Flight addresses this limitation by leveraging zero-knowledge (ZK) proofs to preserve user privacy. Our system maintains the benefits of decentralization and transparency in claim processing, while ensuring that individual flight data remains confidential.


## How does it works

To provide accurate information on flights, we are relying on Amadeus API allowing us to fetch fights information and delay prediction enabling us to compute insurance premium.

When users wants to insure his plane, he will first need to search for his flight on the website. On the server side, we are going to use the Amadeus API to fetch flight information and in the case of existing one, compute the insurance price. 

On the ongoing process, we are aggregating all the flight information in a structure json and the server will signed it using his own certificate. By signing it, the server acknoledge all the information from the Amadeus API, and confirmed the insurance price. This constructed json will then be sent to the user, who can then generate locally a ZK proof using the provided data and the signature attached to it. To subscribe to an insurance, the user can then sign a transaction with the ZK proof attached. On the contract side, it is going to mint a new NFT that will be sent to the user.

In the scenario where the flight got delayed, the user will have to fetch the flight information using the server. Take those information signed by the server and used it locally with the first ZK proof to generate a new one confirming that the flight got delayed. Once generated, he can then sign a new transaction and request to be paid from the smart contract.


## API Limitation

Currently, one of the main limitation is that we are relying on a paid third-party services from Amadeus. This requires a backend server to fetch and sign flight data on behalf of the user.
Consequently, this introduces potential trust issues, as the server will see the user request. He may not know which one the user took as he can request multiple one but still guess the user flight. 


## Premium computation

Our insurance system can be decomposed in 4 states.

- Delays < 15 minutes : No premium for the user. 
- Delays of 15-30 minutes : 30$
- Delays of 30-45 minutes : 50$
- Delays of 45+ minutes : 100$

To be able to compute the premium we are using the Amadeus [api endpoint](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-delay-prediction).

It gives us a set of probabilities for each state. Then, we are computing the probability weigthed given us the expected cost, allowing us to compute the premium price.


## User verification 

At the moment, we do not introduce user verification. However, we want to avoid user to subscribe mutliple times an insurance. To address this issue, one possibility could be to leverage ZK Passport, allowing us to attached to one address a passport proof, which will then limit the number of subscriptions possible.


## Insurance pool - Leverage liquidity

Having liquidity available for the protocol is crucial as we need to be able to pay users. However, not all the liquidity needs to be ready at a given time. It is why it can be interesting to invest a part of it in lending protocol, which can generate an extra yield and can be removed and became available in case we need more liquidity to pay users. By doing so, we are multiplying the source of yield for the protocol.


# Use Garaga Starknet

```bash
cd circuits/flight_booking/
bb write_vk --scheme ultra_honk --oracle_hash keccak -b ./target/flight_booking.json -o ./target

cd ../../contracts/
source .venv/bin/activate
garaga gen --system ultra_keccak_honk --vk ../circuits/flight_booking/target/vk --project-name flightVerifier
```
