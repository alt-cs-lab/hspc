import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import userService from "../../../_common/services/user.js";
import StatusMessages from "../../../_common/components/status-messages/status-messages.jsx";
import "../../../_common/assets/css/create-email.css";

/*
 * @author: Daniel Bell
 * @todo: implement mass email feature
 */
export default class Email extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      emailAll: false,
      email: "",
      subject: "",
      message: "",
      addresslist: [],
    };
  }

  /*
   * Loads the values of registered email addresses.
   */
  componentDidMount() {
    userService
      .getAllUsers()
      .then((response) => {
        if (response.statusCode === 200) {
          let body = JSON.parse(response.body);

          let users = [];
          for (let i = 0; i < body.length; i++) {
            users.push(body[i].Email);
          }
          this.setState({
            addresslist: users,
          });
          console.log(this.state.addresslist);
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  }

  /*
   *  IN PROGRESS
   *  Calls the API and passes email information.
   */
  handleSubmit() {
    if (this.state.emailAll) {
      console.log("Sent All");
      // finish
      console.log(this.state.message);
    } else {
      console.log("Sent Once");
      // finish
      console.log(this.state.message);
    }
  }

  /*
   * Updates the state of emaillAll
   */
  handleChange() {
    if (this.state.emailAll === true) {
      this.setState({ emailAll: false });
      console.log("email all: false");
    } else {
      this.setState({ emailAll: true });
      console.log("email all: true");
    }
  }

  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div>
        <StatusMessages />
        <h2>Create Email</h2>
        <p>
          <b>Please fill out the information below.</b>
        </p>
        <br />

        <Form id="contact-form" method="POST">
          <div className="form-group">
            <p>Email Address</p>
            <input
              id="email"
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              disabled={this.state.emailAll}
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <p>Subject</p>
            <input
              id="subject"
              type="text"
              className="form-control"
              value={this.state.subject}
              onChange={(e) => this.setState({ subject: e.target.value })}
            />
          </div>
          <div className="form-group">
            <p>Message</p>
            <textarea
              id="message"
              className="form-control"
              rows="5"
              value={this.state.message}
              onChange={(e) => this.setState({ message: e.target.value })}
            >
              {
                //changed from massage to message and it now works Natalie Laughlin
              }
            </textarea>
          </div>
          <div id="email-all">
            <p>
              <span>Email All </span>
              <input
                type="checkbox"
                checked={this.state.emailAll}
                onChange={this.handleChange}
              />
            </p>
          </div>
          <Button
            variant="primary"
            id="SubmitButton"
            style={{
              margin: 15,
              backgroundColor: "#00a655",
              color: "white",
              fontSize: 14,
            }}
            onClick={(event) => this.handleSubmit(event)}
          >
            Send Email
          </Button>
        </Form>
      </div>
    );
  }
}

/*
 * HSPC DEV EMAIL INFORMATION
 * username: hspcdev@gmail.com
 * password: hspc2018!
 */

/*
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
*/
