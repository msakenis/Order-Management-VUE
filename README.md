<br />
<p align="center">
  <a href="https://github.com/msakenis/Order-Management-VUE">
    <img src="src/assets/logo3.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ORDER MANAGEMENT APP</h3>

  <p align="center">
    Manage track yours orders (payment, contact, delivery information, etc.)
</p>

<!-- ABOUT THE PROJECT -->

## :bulb: About The Project

This is simply an Order management app which purposes to make it easier to track and manage orders status and client information.

### :hammer: Built With

- Used plain VUE.js with router and history mode;
- Firebase Auth for Authentication;
- Firebase Firestore for the database;
- Buefy for css and some functionality;
- Vue-html-to-paper plugin to create pdf orders feature;

<!-- GETTING STARTED -->

## :paperclip: Getting Started

### :mag_right: Demo version

You can try the demo version <a href="https://fir-order-management-6a828.web.app/">here</a>

PLEASE USE USER TO LOGIN:
email: demo@demo.lt
password: 123456

Firebase rules set that only demo user can add orders.

### :computer: Installation

To get a local copy up and running follow these simple steps.

1. Clone the repo

```sh
git clone https://github.com/msakenis/Order-Management-VUE
```

2. Install NPM packages

```sh
npm install
```

3. Go to Firebase console and make these steps:

- create a new web project and copy the config src/services/firebase-config.js,
- enable authentification by email and password and google,
- create firestore database (if you are going to use this app not only for a demo, do not forget to set the rules!)

  <!-- USAGE EXAMPLES -->

## :rocket: Usage

1. Click on "Add new order" and create your first order!

You can to add and edit the following information :

- Order Date(by default always today, but you can change to any);
- Order no. (Automatically generated unique six symbol number by the system);
- Client information;
- Order information ( you can add and remove as many products as you want with "add" and "remove" buttons);
- Delivery Information (If you select delivery method Omniva it will automatically fetch the list of Post Terminals from Omniva API, all other you must enter manually);
- Status information (according to the checkboxes checked system will return the order status which you can check in the View Orders tab)
- Custom Note (you can add a custom note to the order and the "Note" symbol will appear in the View Orders tab and if you move the mouse cursor on the symbol you can see the note itself);

2. Click on "View Orders" and track your Orders!

- To search for the specific order or just filter by any parameter, you just enter those parameters in search inputs above the table;
- To update or delete an order just press the "Edit" icon in the Actions column and simply update the order in the same way as add new order;
- To check more information about the order just click the "Info" icon in the Action tab and you will see all information visually structured as one-pager(Also you can click to "print" button and save as pdf, it will automatically create one-page pdf file to fit the order);

## :email: Contact

Created by Mindaugas Sakenis, m.sakenis@gmail.com

Project Link: [https://github.com/msakenis/Order-Management-VUE](https://github.com/msakenis/Order-Management-VUE)
