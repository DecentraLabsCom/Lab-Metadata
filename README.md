---
description: Metadata specification for tokenized online labs
---

# Lab Metadata

**DecentraLabs** is a community project for sharing online laboratories (OLs) in a decentralized way. It enables universities and research institutions to list their labs and offer secure, blockchain-based access to users via smart contracts and a decentralized marketplace.

This repository defines the metadata schema used to describe each lab and provides guidelines on how to store and link that information within the DecentraLabs infrastructure.

***

## 🧬 Metadata Structure

Laboratories are represented as non-fungible tokens (NFTs) compliant with the [EIP-721](https://github.com/ethereum/ercs/blob/master/ERCS/erc-721.md) standard and are uniquely identified by their corresponding token ID ($labId$). Each lab is described using a structured set of fields, enabling effective management, visibility, reservation, and access. The following metadata specification adheres to the ERC-721 Metadata JSON Schema:

```js
{
  "name": "tokenName",                // Lab name or title
  "description": "tokenDescription",  // Short but informative description of the lab
  "image": "primaryImageURI",         // Primary image URI for the lab
  "attributes": [                     // Optional and customizable attributes
    {
      "trait_type": "traitName1",
      "value": "traitValue1"
    },
    {
      "trait_type": "traitName2",
      "value": [
        "traitValue2-1",
        "traitValue2-2",
        ...
        "traitValue2-M"
      ]
    },
    ...
    {
      "trait_type": "traitNameN",
      "value": "traitValueN"
    }
  ]
}

```

The provider's address is not considered part of the metadata (as it happens with $id$), but it can be obtained with the IERC721 standard ownerOf(tokenId/labId) function. If the lab provider's name is needed, a query to the ProviderFacet smart contract (using the provider's address) is required.

Metadata is divided between two storage models: on-chain and off-chain.

* The attributes stored on-chain are managed in the LabFacet smart contract.
* The attributes stored off-chain are placed in a JSON document hosted externally (e.g., on IPFS). The URI to this document is referenced by the base.uri attribute in the contract.

## ⚖️ On-Chain vs. Off-Chain Metadata

### What Goes On-Chain

First, let's analyze the advantages and disadvantages of this way of storing data.

**Advantages:**

* Trust and immutability: Data stored on-chain is tamper-proof and publicly verifiable.
* Payment and access logic: Metadata like price, accessURI, and accessKey directly impacts business logic.
* Autonomous operations: Enables dApps and smart contracts to function trustlessly.

**Disadvantages:**

* Gas fees: Updating on-chain data requires a transaction and incurs a cost.
* Size constraints: Blockchain storage is expensive and limited.

✅ In DecentraLabs, the following attributes are stored on-chain in the LabFacet contract (see the [Smart contracts specification](https://github.com/DecentraLabsCom/Smart-Contract-Specifications)) to ensure transparency and integrity of critical service-related data:

* $id$
* $price$
* $auth$
* $accessURI$
* $accessKey$

This design guarantees that lab providers cannot silently change core access parameters (such as access endpoints or authentication mechanisms) after a reservation has been made, without it being publicly visible on the blockchain. Any modification would require a new transaction, creating an immutable audit trail. This promotes accountability and protects users by making unauthorized or unexpected changes detectable by anyone.

### What Stays Off-Chain

Again, we first review the advantages and disadvantages of this approach.

**Advantages:**

* Flexibility and cost-free updates: Easily updated without gas fees (when no hash is stored onchain)
* Rich content: Enables large text, documentation, and media.
* Integration-friendly: Easier to use in traditional web systems.

**Disadvantages:**

* Less secure: While IPFS provides immutability, its availability depends on pinning and hosting strategies.
* Not trustlessly verifiable: Unless a content hash is stored on-chain.

✅ Thus, DecentraLabs stores the following off-chain, referenced via base.uri:

* $name$ — string, human-readable lab name.
* $category$ — string, taxonomy key (lowercase slug).
* $keywords$ — array of strings, tags for search.
* $description$ — string, human-readable summary.
* $timeSlots$ — array of numbers (minutes), positive integers.
* $closes$ — number (Unix seconds), lab close date (inclusive).
* $opens$ — number (Unix seconds), lab open date (inclusive).
* $docs$ — array of absolute URLs (PDF).
* $images$ — array of absolute URLs (first one is main image).
* $availableDays$ — array of strings, one of MONDAY..SUNDAY.
* $availableHours$ — object { start: "HH:mm", end: "HH:mm" } in lab timezone.
* $timezone$ — string, IANA timezone id (e.g., Europe/Madrid).
* $maxConcurrentUsers$ — integer > 0.
* $unavailableWindows$ — array of { startUnix: number, endUnix: number, reason: string } with start < end.
* $termsOfUse$ — object { url, version, effectiveDate (Unix seconds), sha256 } (sha256 optional).

📝 Note: Attributes like $timeSlots$, $opens$, and $closes$ do not affect a completed reservation, as each reservation is individually recorded (immutably) on-chain in the ReservationFacet contract (visit [Smart contracts specification](https://github.com/DecentraLabsCom/Smart-Contract-Specifications) for more information). This makes them ideal candidates for off-chain storage, along with the other attributes listed above.

## 🏷️ Sample Metadata

### 🔗 Sample On-chain Metadata

```yaml
id: 1
price: 2
auth: "https://decentralabs.nebsyst.com/auth2"
accessURI: "https://sarlab.dia.uned.es/guacamole"
accessKey: "lab1"
```

### 🧾 Sample Off-chain Metadata JSON

```js
{
  "name": "Basic Electronics Lab", // Required by ERC-721
  "description": "Design circuits with an easy-to-use schematic editor. Become familiar with the common electrical tools and components used for circuits and use them to experimentally test theoretical concepts.", // Required by ERC-721
  "image": "https://sarlab.dia.uned.es/labs/imgs/lab1-1.png", // First image as primary representation (ERC-721 expects one main image)
  "attributes": [ // Custom attributes consumed by the marketplace
    { "trait_type": "category", "value": "electronics" },
    { "trait_type": "keywords", "value": ["Ohm's Law", "Power Dissipation", "Kirchhoff's Laws", "Series/Parallel Resistors"] },
    { "trait_type": "timeSlots", "value": [30, 60] },
    { "trait_type": "opens", "value": 1749945600 },   // Unix seconds (2025-06-15)
    { "trait_type": "closes", "value": 1767139200 },  // Unix seconds (2025-12-31)

    { "trait_type": "docs", "value": ["https://sarlab.dia.uned.es/labs/docs/lab1-1.pdf", "https://sarlab.dia.uned.es/labs/docs/lab1-2.pdf"] },
    { "trait_type": "additionalImages", "value": ["https://sarlab.dia.uned.es/labs/imgs/lab1-2.png", "https://sarlab.dia.uned.es/labs/imgs/lab1-3.png"] },
    { "trait_type": "availableDays", "value": ["MONDAY", "TUESDAY", "WEDNESDAY"] },
    { "trait_type": "availableHours", "value": { "start": "09:00", "end": "17:00" } },
    { "trait_type": "timezone", "value": "Europe/Madrid" },
    { "trait_type": "maxConcurrentUsers", "value": 3 },
    {
      "trait_type": "unavailableWindows",
      "value": [
        { "startUnix": 1751364000, "endUnix": 1751371200, "reason": "Maintenance" }
      ]
    },
    {
      "trait_type": "termsOfUse",
      "value": { "url": "https://example.com/terms-v1.pdf", "version": "1.0", "effectiveDate": 1748736000, "sha256": "abc123..." }
    }
  ]
}
```

## 🤝 Contributing

We welcome community contributions!

Suggest improvements to the metadata schema.

Propose best practices for metadata management.

Help optimize the contract-off-chain balance.

Share your lab metadata examples.
