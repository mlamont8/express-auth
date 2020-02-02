/**
 * test/test.js
 * Basic tests for Auth system API
 */
const chai = require("chai");
const expect = chai.expect;

//start app
const app = require("../app");

//import chai-http to send requests to the app
const http = require("chai-http");
chai.use(http);

describe("App basics", () => {
  it("Should exists", () => {
    expect(app).to.be.a("function");
  });

  it("GET / should return 200 and message", done => {
    //send request to the app
    chai
      .request(app)
      .get("/")
      .then(res => {
        //assertions
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body.message).to.contain("Yabadabadooo");
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

describe("User registration", () => {
  it("Should return 201 and confirmation for valid input", done => {
    //mock valid user input
    const new_user = {
      name: "John Wick",
      email: "john@wick.com",
      password: "secret"
    };
    //send request to the app
    chai
      .request(app)
      .post("/register")
      .send(new_user)
      .then(res => {
        //assertions
        expect(res).to.have.status(201);
        expect(res.body.message).to.be.equal("User created!");
        expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

describe("User login", () => {
  it("should return 200 and token for valid credentials", done => {
    //mock invalid user input
    const valid_input = {
      email: "john@wick.com",
      password: "secret"
    };
    //send request to the app
    chai
      .request(app)
      .post("/login")
      .send(valid_input)
      .then(res => {
        console.log(res.body);
        //assertions
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;
        expect(res.body.message).to.be.equal("Auth OK");
        expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});
