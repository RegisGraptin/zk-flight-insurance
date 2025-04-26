

openssl genpkey -algorithm RSA -out private_key.pem -aes256 -pass pass:$CERT_PASS

openssl rsa -pubout -in private_key.pem -out public_key.pem