# Lab-Metadata

**DecentraLabs** is a community project for sharing online laboratories (OLs) in a decentralized way. It enables universities and research institutions to list their labs and offer secure, blockchain-based access to users via smart contracts and a decentralized marketplace.

This repository defines the metadata schema used to describe each lab and provides guidelines on how to store and link that information within the DecentraLabs infrastructure.

---

## 🧬 Metadata Structure
Each lab is described using a structured set of fields, enabling effective management, visibility, reservation, and access. Below is the current metadata specification:

```js
{
  id: labId,                        // Unique lab identifier
  price: labPrice,                  // Price (per hour) in $LAB tokens
  auth: labAuth,                    // URI to the authentication service that issues session tokens for lab access
  accessURI: labAccessURI,          // URI to the online laboratory service
  accessKey: labAccessKey,          // A public (non-sensitive) key or ID used for routing/access
  name: labName,                    // Lab name or title
  category: labCategory,            // Category (e.g. Physics, Electronics, Chemistry...)
  keywords: labKeywords,            // Search-friendly tags
  description: labDescription,      // Short but informative description of the lab
  provider: labProvider,            // Name of the institution or company that provides this lab
  timeSlot: labTimeSlot,            // Duration of access in minutes
  startDate: labStartDate,          // The date from which the lab is open for reservations
  finishDate: labFinishDate,        // The date until the lab is open for reservations
  docs: labDocs,                    // URIs to documentation associated to the lab
  images: labImages                 // URIs to images of the laboratory
}
```

Metadata is divided between two storage models: on-chain and off-chain.

* The attributes stored on-chain are managed in the LabFacet smart contract.

* The attributes stored off-chain are placed in a JSON document hosted externally (e.g., on IPFS). The URI to this document is referenced by the base.uri attribute in the contract.

## ⚖️ On-Chain vs. Off-Chain Metadata
### What Goes On-Chain
First, let's analyze the advantages and disadvantages of this way of storing data.

**Advantages:**

* Trust and Immutability: Data stored on-chain is tamper-proof and publicly verifiable.

* Payment and Access Logic: Metadata like price, accessURI, and accessKey directly impacts business logic.

* Autonomous Operations: Enables dApps and smart contracts to function trustlessly.

**Disadvantages:**

* Gas Fees: Updating on-chain data requires a transaction and incurs a cost.

* Size Constraints: Blockchain storage is expensive and limited.

✅ In DecentraLabs, the following attributes are stored on-chain to ensure transparency and integrity of critical service-related data:

* id
* price
* auth
* accessURI
* accessKey

This design guarantees that lab providers cannot silently change core access parameters (such as access endpoints or authentication mechanisms) after a reservation has been made, without it being publicly visible on the blockchain. Any modification would require a new transaction, creating an immutable audit trail. This promotes accountability and protects users by making unauthorized or unexpected changes detectable by anyone.

### What Stays Off-Chain
Again, we first review the advantages and disadvantages of this approach.

**Advantages:**

* Flexibility and Cost-Free Updates: Easily updated without gas fees (when no hash is stored onchain)

* Rich Content: Enables large text, documentation, and media.

* Integration-Friendly: Easier to use in traditional web systems.

**Disadvantages:**

* Less Secure: While IPFS provides immutability, its availability depends on pinning and hosting strategies.

* Not Trustlessly Verifiable: Unless a content hash is stored on-chain.

✅ Thus, DecentraLabs stores the following off-chain, referenced via base.uri:

* name
* category
* keywords
* description
* provider
* timeSlot
* startDate
* finishDate
* docs
* images

📝 Note: Attributes like timeSlot, startDate, and finishDate do not affect a completed reservation, as each reservation is individually recorded (immutably) on-chain in the ReservationFacet contract. This makes them ideal candidates for off-chain storage, along with the others.

🧾 Sample Metadata JSON

```js
{
  "name": "Basic Electronics Lab",
  "auth": "https://decentralabs.nebsyst.com/auth2",
  "accessURI": "https://sarlab.dia.uned.es/guacamole",
  "accessKey": "lab1",
  "category": "Electronics",
  "keywords": ["Ohm’s Law", "Power Dissipation", "Kirchhoff’s Laws", "Series/Parallel Resistors"],
  "description": "Design circuits with an easy-to-use schematic editor. Become familiar with some of the common electrical tools and components used for circuits and use them to experimentally test and confirm the validity of theoretical concepts.",
  "provider": "UNED",
  "timeSlot": [30, 60],
  "startDate": "2025-06-01",
  "finishDate": "2025-12-31",
  "docs": [
    "https://sarlab.dia.uned.es/labs/docs/lab1-1.pdf",
    "https://sarlab.dia.uned.es/labs/docs/lab1-2.pdf"
  ],
  "images": [
    "https://sarlab.dia.uned.es/labs/imgs/lab1-1.png",
    "https://sarlab.dia.uned.es/labs/imgs/lab1-2.png"
  ]
}
```

## 🤝 Contributing
We welcome community contributions!

Suggest improvements to the metadata schema.

Propose best practices for metadata management.

Help optimize the contract-off-chain balance.

Share your lab metadata examples.
