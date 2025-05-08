import { createHash, createPrivateKey, createSign } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';


// Use the private key of the server to sign the message
console.log(join(process.cwd(), 'src', 'cert', 'private_key.pem'))
const encryptedPrivateKey = readFileSync(join(process.cwd(), 'src', 'cert', 'private_key.pem'), 'utf8');

const privateKey = createPrivateKey({
    key: encryptedPrivateKey,
    format: 'pem',
    passphrase: process.env.CERT_PASS,  
});


function formatDataToHash(data: any) {
    const ascii = (str: string): bigint[] => str.split('').map(c => BigInt(c.charCodeAt(0)));
    const dateParts = data.scheduledDepartureDate.split('-').map((n: string) => BigInt(n));

  return [
    ...ascii(data.carrierCode),            // [65, 70]
    ...ascii(data.flightNumber.padEnd(4)), // [48, 50, 54, 52]
    ...dateParts,                          // [2025n, 4n, 29n]
    BigInt(data.price),                    // 25n
    data.planeValid ? 1n : 0n,             // 1n
    data.insuranceValid ? 1n : 0n          // 1n
  ];
}

function convertBigIntArrayToBuffer(bigInts: bigint[]): Buffer {
    const bufferArray = bigInts.map(b => Buffer.from(b.toString())); // Convert each bigint to a Buffer
    return Buffer.concat(bufferArray); // Concatenate all buffers into one
}

export function signFlightData(data: any) {

    // Prepare the data 
    const canonicalBigIntArray = formatDataToHash(data);
    const canonicalBuffer = convertBigIntArrayToBuffer(canonicalBigIntArray);

    // Compute the hash of the data
    const hash = createHash('sha256').update(canonicalBuffer).digest(); // or .digest('hex')

    // Create a hash from it
    const sign = createSign('RSA-SHA256');  // pkcs1v15 in noir 
    sign.update(canonicalBuffer);
    sign.end();

    // Sign the hash
    const signature = sign.sign(privateKey, 'base64');

    return {
        data: data,
        hash: hash,
        signature: signature,
    }
}
