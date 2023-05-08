const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let url = "/api/issues/apitest";

suite("Functional Tests", function () {
    this.timeout(5000);

    let test_id;

    test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai.request(server)
            .post(url)
            .type("form")
            .send({
                issue_title: "Test Title",
                issue_text: "Test body text",
                created_by: "Cath",
                assigned_to: "Cath",
                status_text: "Backlogged",
            })
            .end(function (err, res) {
                test_id = res.body._id;
                assert.equal(res.status, 200);
                assert.isNotEmpty(res.body._id);
                assert.equal(res.body.open, true);
                assert.equal(res.body.project, "apitest");
                assert.equal(res.body.issue_title, "Test Title");
                assert.equal(res.body.issue_text, "Test body text");
                assert.equal(res.body.created_by, "Cath");
                assert.equal(res.body.assigned_to, "Cath");
                assert.equal(res.body.status_text, "Backlogged");
                assert.isNotEmpty(res.body.updated_on);
                assert.isNotEmpty(res.body.created_on);
                done();
            });
    });

    test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
        chai.request(server)
            .post(url)
            .type("form")
            .send({
                issue_title: "Test Title",
                issue_text: "Test body text",
                created_by: "John",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isNotEmpty(res.body._id);
                assert.equal(res.body.open, true);
                assert.equal(res.body.project, "apitest");
                assert.equal(res.body.issue_title, "Test Title");
                assert.equal(res.body.issue_text, "Test body text");
                assert.equal(res.body.created_by, "John");
                assert.equal(res.body.assigned_to, "");
                assert.equal(res.body.status_text, "");
                assert.isNotEmpty(res.body.updated_on);
                assert.isNotEmpty(res.body.created_on);
                done();
            });
    });

    test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
        chai.request(server)
            .post(url)
            .type("form")
            .send({
                issue_title: "Test Title",
            })
            .end(function (err, res) {
                assert.equal(res.status, 500);
                assert.equal(res.body.error, "required field(s) missing");
                done();
            });
    });

    test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .get(url)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 2);
                done();
            });
    });

    test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .get(url + "?created_by=Cath")
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].created_by, "Cath");
                done();
            });
    });

    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .get(url + "?created_by=Cath&open=true")
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].created_by, "Cath");
                assert.equal(res.body[0].open, true);
                done();
            });
    });

    test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .put(url)
            .type("form")
            .send({
                _id: test_id,
                issue_title: "Test New Title",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully updated");
                assert.equal(res.body._id, test_id);
                done();
            });
    });

    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .put(url)
            .type("form")
            .send({
                _id: test_id,
                issue_title: "Test New Title",
                issue_text: "New issue text",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully updated");
                assert.equal(res.body._id, test_id);
                done();
            });
    });

    test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .put(url)
            .type("form")
            .send({
                issue_title: "Test New Title",
            })
            .end(function (err, res) {
                assert.equal(res.status, 500);
                assert.equal(res.body.error, "missing _id");
                done();
            });
    });

    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .put(url)
            .type("form")
            .send({
                _id: test_id,
            })
            .end(function (err, res) {
                assert.equal(res.status, 500);
                assert.equal(res.body.error, "no update field(s) sent");
                done();
            });
    });

    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .put(url)
            .type("form")
            .send({
                _id: "xxxxxx",
                issue_text: "Some test text",
            })
            .end(function (err, res) {
                console.log(res.body);
                assert.equal(res.status, 500);
                assert.equal(res.body.error, "could not update");
                done();
            });
    });

    test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
        chai.request(server)
            .delete(url)
            .type("form")
            .send({
                _id: test_id,
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully deleted");
                done();
            });
    });

    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
        chai.request(server)
            .delete(url)
            .type("form")
            .send({
                _id: "xxxx",
            })
            .end(function (err, res) {
                assert.equal(res.status, 500);
                assert.equal(res.body.error, "could not delete");
                done();
            });
    });

    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
        chai.request(server)
            .delete(url)
            .type("form")
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 500);
                assert.equal(res.body.error, "missing _id");
                done();
            });
    });
});
