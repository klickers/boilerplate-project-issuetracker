"use strict";

const { Issue } = require("../helpers/db");

module.exports = function (app) {
    app.route("/api/issues/:project")

        .get(async function (req, res) {
            req.query.project = req.params.project;
            if (req.query.open) req.query.open = req.query.open === "true";

            try {
                const issues = await Issue.findAll({
                    where: {
                        ...req.query,
                    },
                });
                res.status(200).json(issues);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        })

        .post(async function (req, res) {
            let project = req.params.project;
            const {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
            } = req.body;

            if (!issue_title || !issue_text || !created_by) {
                res.status(500).json({ error: "required field(s) missing" });
                return;
            }

            try {
                const issue = await Issue.create({
                    project,
                    issue_title,
                    issue_text,
                    created_by,
                    assigned_to,
                    status_text,
                });
                res.status(200).json(issue);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        })

        .put(async function (req, res) {
            const { _id } = req.body;
            if (!_id) {
                res.status(500).json({ error: "missing _id" });
                return;
            }
            if (Object.keys(req.body).length === 1) {
                res.status(500).json({ error: "no update field(s) sent", _id });
                return;
            }

            try {
                let issue = await Issue.update(
                    { ...req.body },
                    {
                        where: {
                            _id,
                        },
                    }
                );
                if (!issue[0]) throw new Error();
                res.status(200).json({ result: "successfully updated", _id });
            } catch (e) {
                res.status(500).json({ error: "could not update", _id });
            }
        })

        .delete(async function (req, res) {
            const { _id } = req.body;
            if (!_id) {
                res.status(500).json({ error: "missing _id" });
                return;
            }

            try {
                let issue = await Issue.destroy({
                    where: {
                        _id,
                    },
                });
                if (!issue) throw new Error();
                res.status(200).json({ result: "successfully deleted", _id });
            } catch {
                res.status(500).json({ error: "could not delete", _id });
            }
        });
};
