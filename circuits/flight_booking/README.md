# Noir Circuit Project

## Project Description

<!-- FIXME: -->

---

## Commands Overview

### 🔧 **Project Setup & Build**
- **Compile the Noir program**:
  ```bash
  nargo build
  ```

- **Type-check without building**:
  ```bash
  nargo check
  ```

---

### ▶️ **Running Programs**
- **Run a function (without generating proof)**:
  ```bash
  nargo execute <function_name>
  ```

- **Compile a specific function**:
  ```bash
nargo compile <function_name>
  ```

---

### ✅ **Testing**
- **Run all tests**:
  ```bash
  // nargo test
  ```

- **Run test for a specific function**:
  ```bash
  // nargo test <function_name>
  ```

---

### 🔐 **Proving & Verifying**
- **Generate proof for a function**:
  ```bash
  // nargo prove <function_name>
  ```

- **Verify the generated proof**:
  ```bash
  // nargo verify <function_name>
  ```

---

### 📄 **WIT/ABI Generation**
- **Generate the verifier contract for integration**:
  ```bash
  // nargo codegen-verifier
  ```

- **Output ABI in JSON format**:
  ```bash
  // nargo print-abi
  ```

---

## Circuit Description

<!-- Add detailed description of the circuit, its purpose, and logic here -->



https://github.com/privacy-scaling-explorations/zk-kit.noir/tree/main/packages/ecdh


```json
{
    "data": {
        "carrierCode": "AF",
        "flightNumber": "0264",
        "scheduledDepartureDate": "2025-04-29",
        "price": 25,
        "planeValid": true,
        "insuranceValid": true
    },
    "signature": "NGe1F7D4xjYNO79kjfOZKy33A1y/JELuFP8YurgsJ8Ke66Sx+sGvDb2TdW2PKLhHSJbCZ0sMr4Nhcdru4LL2mmQbwWnYk2BewbbVU9L+AaUSY+go0Z29JLfpdHJmLWF6LWr/MUtU8JTJo44e1ptBbgC0taqI2Pf3L6EOCIl3xzxcou5rWCe/0FVFL8sRMUpknNLfEmHjhpDimzg3+ob9Q3Cp12dFOpk54Fn1oL+pUuVPLGE6YC3YvGJLCHtktS+hkZLQiUiV3ft8pGJE7JibEXn+qEIWwPkhuLF4Tjukf4MuRj3UgmoFazSFM6yTQQAEevw0Ww0RnvTjudHCqrBHJw=="
}
```



