
use sha256;
use noir_rsa::rsa;
use noir_rsa::types::RBN2048;


// verify_flight
fn main(
    carrier_code: [Field; 2],     // e.g. 'A' = 65, 'F' = 70
    flight_number: [Field; 4],    // '0','2','6','4' as ASCII at max, can be other char as 4DF
    date: [Field; 3],             // [2025, 4, 29]
    price: Field,                 // 25
    plane_valid: Field,           // 1 for true
    insurance_valid: Field,       // 1 for true
    // Public 
    hash_data: [u8; 32], 
    signature: RBN2048,           // The signature from the certificate
    public_key: Field           // The public key to verify the signature
) {

    // FIXME: optimization send only the hash??
    // Issue could be on the date? What if I generate locally multiple issue and wait until we get the right one?

    // Field::from(32) => encode the ASCII " "

    // Verify the flag are correct
    assert_eq(plane_valid, 1);
    assert_eq(insurance_valid, 1);
    assert((price as u8) > 0);
    assert((price as u8) < 200);

    // Concatenate fields into a list for hashing
    let mut combined_data: [u8; 12] = [
        carrier_code[0] as u8,          // 'A' -> 65
        carrier_code[1] as u8,          // 'F' -> 70
        Field::from(32) as u8,          // Placeholder for flight_number[0]
        Field::from(32) as u8,          // Placeholder for flight_number[1]
        Field::from(32) as u8,          // Placeholder for flight_number[2]
        Field::from(32) as u8,          // Placeholder for flight_number[3]
        date[0] as u8,                  // 2025  FIXME:
        date[1] as u8,                  // 4
        date[2] as u8,                  // 29
        price as u8,                    // 25
        plane_valid as u8,              // 1
        insurance_valid as u8           // 1
    ];


    // Flight number can be variable put up to 4 character
    for i in 0..flight_number.len() {  
        combined_data[2+i] = flight_number[i] as u8;
    }

    // Compute the hash of the combined data using Poseidon
    let hashed_data: [u8; 32] = sha256::digest(combined_data).into();

    // Check the input hash
    assert_eq(hash_data, hashed_data);

    assert(rsa::verify_sha256_pkcs1v15(
        hashed_data, 
        signature, 
        65537  // Mostly used parameter (fixed)
    ));

}

// #[test]
// fn test_verify_flight() {
//     verify_flight(
//         [65, 70],  // AF
//         [0,2,6,4],  // FIXME: Need to conver to ASCII
//         [2025, 4, 29],             // [2025, 4, 29]
//         25,                 // 25
//         1,           // 1 for true
//         1,       // 1 for true
//         // Public 
//         hash_data: [
//             110,
//             155,
//             187,
//             195,
//             71,
//             192,
//             157,
//             198,
//             199,
//             248,
//             55,
//             78,
//             248,
//             223,
//             153,
//             161,
//             224,
//             139,
//             91,
//             64,
//             124,
//             33,
//             205,
//             164,
//             237,
//             52,
//             124,
//             8,
//             118,
//             0,
//             211,
//             113
//         ], 
//         signature: "h9G/TIe+otw6xGeqP3ZFhnxRk0bKPnQp6m08/jnrr04GpF+QYVc8N9anNA29bosYtQkCA6kW5CiehoCXTrafIUCgNZ8oGoTXq1Gk1CoTSHNSBxJbhBXqX30HnwuNcXCDs93NxcaDCi5bEntb7R0MFc35erwqi2FJBnSWDaQvLjtCV/8WhKMztmwlBMCFbB1NlTWxzLppYeaIpXF6zCb8+RjMna6HC9YYNf7LIUfUbMEnvwp7ZmTJgtm6xoCxo/GhcEJb/9RF5J7w9HK9ymbB+BNOYxv3D+UYq7PNZrj3ua/owELQTWFL3PNcKVyaMKBTNF2zq6mUZuAwJ4MwHeSZQA==",
//         public_key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArNz2t69UIGA+WUCvOuFSI94Ib1ykRkdvhMuJesC7PZUYcWJNgEfvQ7ACnSZQwVEkuYlQugoEyWWb6cI/VGq5ZXYbTTDp+7R9kjyZQ0vYt4k/TOr/HGosAZXce6LdwMRzwPRmGPfoF9fbLWSlwu/gzfJIDaTqob7+hwpowPQYTuvVoFJyB9kS7jKOCYByQfyoiFuD8GrTSGKXVbiWAA6gCgHUu4s9vOgTWhcVF4F62DjODdhlvJTH6+xgUE6XIa2ZTtjEr7gp87QxmhIy9/F3ZY42mwaXvNZ3HdmZuE38toKTx7cVGbICR+gx1N+AMET2K8Vcs5fzeGeOcjHP7z1kWwIDAQAB"
//     );

// }
