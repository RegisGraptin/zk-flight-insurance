

# ZK-Flight: Privacy-Preserving On-Chain Flight Insurance

On-chain insurance enables clear, programmable rules and decentralized management. However, current implementations suffer from a critical flaw: lack of privacy. Anyone can observe insurance purchases and infer user habits.

ZK-Flight addresses this limitation by leveraging zero-knowledge (ZK) proofs to preserve user privacy. Our system maintains the benefits of decentralization and transparency in claim processing, while ensuring that individual flight data remains confidential.


## How does it works / User workflow

To manage the insurance and flght data, we are using the Amadeus API, allowing us to fetch flight information and flight delay prediction to compute the insurance premium. 

To propose this services, the user will first search for his flight on the website. Then, on the server, we are going to use the Amadeus API to fetch the flight information and in the case of existing one, compute the insurance price. Then, once the data computed, we are going to aggregate them and signed it with the server certificat. All those information are then send to the user, who can validate and generate a ZK proof of the flight information. To subscribe to the insurance, the user can then sign a transaction with the ZK proof attached. On the contract side, it is going to mint a new NFT that will be sent to the user.

On the scenario, the flight got delay, the user will have to fetch the flight information using the server. Take those information signed by it and by using the first ZK proof, generate a new ZK proof allowing them to confirmed that the flight was delay. Once done, he can then sign a transaction and request the smart contract.


## Limitation

Currently, one of the main limitation is that we are relying on a pay services from Amadeus. Meaning that for user experience, we need to have a server that is going to sign and manage the transaction. 
This can introduce a lack of trust for the user as the server will see the user request. He may not know which one he took as he can request multiple one but still guess the user flight. 


## Premium computation

Our insurance system can be decomposed in 4 states.

- Delays < 15 minutes : No premium for the user. 
- Delays of 15-30 minutes : 30$
- Delays of 30-45 minutes : 50$
- Delays of 45+ minutes : 100$

To be able to compute the premium we are using the Amadeus [api endpoint](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-delay-prediction).

It gives us a set of probabilities for each state. Then, we are computing the probability weigthed given us the expected cost.




## Limit user flood

A verification needs to be made to avoid too much insurance subscription. 
Also, avoid subscription just before close to have the information or eventually after.


## Amadeus Flight API


test.api.amadeus.com/v1


## Insurance pool 

By having liquidity available and on a long run a rentable mechanism. 
We can provide other way to remunerate stagnate liuquidty. We can use it for landing on only a part of the pool.


## Insurance policies

Delays < 15 minutes 
Delays of 15-30 minutes
Delays of 30-45 minutes
Delays of 45+ minutes

Customer selects a flight they want to insure by providing flight data (airline code, flight number, departure/arrival airports, and date).
Premium calculation is based on statistics of the flight's historical performance. The premium amount reflects the risk of delay/cancellation.
Payouts are calculated at the time of purchase based on the premium amount, with maximum caps to limit risk exposure.








Oracle Trust Minimization
To address your concern about trusting the oracle data, we can implement several safeguards:
Multi-Oracle Consensus: Require data to be signed by multiple independent flight data providers
Delayed Finality: Allow a challenge period for incorrect flight database entries
Public Verifiability: Make the flight database publicly queryable, even though individual policies remain private
Cryptographic Attestation: Have oracles sign their datasets with secure timestamps



# Use Garaga Starknet

```bash
cd circuits/flight_booking/
bb write_vk --scheme ultra_honk --oracle_hash keccak -b ./target/flight_booking.json -o ./target

cd ../../contracts/
source .venv/bin/activate
garaga gen --system ultra_keccak_honk --vk ../circuits/flight_booking/target/vk --project-name flightVerifier
```
