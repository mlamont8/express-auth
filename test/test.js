/**
 * test/test.js
 * Basic tests for Auth system API
 */
const chai = require("chai");
const expect = chai.expect;

//start app
const app = require("../app");
const User = require("../api/user");

//import chai-http to send requests to the app
const http = require("chai-http");
chai.use(http);

// Should exist
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

// /Delete users before register test

describe("App basic tests", () => {
  before(done => {
    //delete all users
    User.find()
      .deleteMany()
      .then(res => {
        console.log("Users removed");
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  // Should register users

  describe("User registration", () => {
    it("/register should return 201 and confirmation for valid input", done => {
      //mock valid user input
      let user_input = {
        name: "John Wick",
        email: "john@wick.com",
        password: "secret"
      };
      //send /POST request to /register
      chai
        .request(app)
        .post("/register")
        .send(user_input)
        .then(res => {
          //validate
          expect(res).to.have.status(201);
          expect(res.body.message).to.be.equal("User registered");

          //new validations to confirm user is saved in database
          expect(res.body.user._id).to.exist;
          expect(res.body.user.createdAt).to.exist;

          //done after all assertions pass
          done();
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});
// Should login

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
