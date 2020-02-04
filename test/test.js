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
          console.log(res.body.user);
          //new validations to confirm user is saved in database
          expect(res.body.user._id).to.exist;
          expect(res.body.user.createdAt).to.exist;
          //validation to confirm password is encrypted
          expect(res.body.user.password).to.not.be.eql(user_input.password);

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

// Use Token to access a protected route
describe("Protected route", () => {
  it("should return 200 and user details if valid token provided", done => {
    //mock login to get token
    const valid_input = {
      email: "john@wick.com",
      password: "secret"
    };
    //send login request to the app to receive token
    chai
      .request(app)
      .post("/login")
      .send(valid_input)
      .then(login_response => {
        //add token to next request Authorization headers as Bearer adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
        const token = "Bearer " + login_response.body.token;
        chai
          .request(app)
          .get("/protected")
          .set("Authorization", token)
          .then(protected_response => {
            //assertions
            expect(protected_response).to.have.status(200);
            expect(protected_response.body.message).to.be.equal(
              "Welcome, your email is john@wick.com"
            );
            expect(protected_response.body.user.email).to.exist;
            expect(protected_response.body.errors.length).to.be.equal(0);

            done();
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  after(done => {
    //stop app server
    console.log("All tests completed, stopping server....");
    process.exit();
    done();
  });
});
