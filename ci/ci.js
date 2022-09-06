const express = require('express');
const Process = require("process");
const { exec } = require("child_process");
const app = express();
const port = 4567;

app.use(express.json())

function prefix(name)
{
    return "[" + name + "]";
}

function isWorkflowEnd(req, name)
{
    const status = req.body.workflow_run.status;
    const conclusion = req.body.workflow_run.conclusion;

    if (status === "queued")
        console.log(prefix(name) + "Workflow started update incoming...");
    else if (status === "completed")
    {
        console.log(prefix(name) + "Workflow completed.");
        if (conclusion === "failure")
            console.log(prefix(name) + "Workflow failed! Please check on the github action page for more information.");
        else if (conclusion === "success") {
            console.log(prefix(name) + "Workflow end with success. Start updating...");
            return true;
        }
    }
    else {
        console.log(prefix(name) + "Unknown status. (" + status + ")");
    }
    return false;
}

function canDeploy(req, name, callback)
{
    if (isWorkflowEnd(req, name))
    {
        const branch = req.body.workflow_run.head_branch;
        if (branch === Process.env.CI_BRANCH) {
            console.log(prefix(name) + "Starting deploying with brach " + branch + "...");
            callback();
            return true;
        }
    }
    return false;
}

app.post('/payload', (req, res) => {
    const name = req.body.repository.name;

    canDeploy(req, name, () => { console.log("Nothing to deploy it's just a test!") });
    res.status(200).send();
});

app.post('/ci_theed', (req, res) => {
    const name = req.body.repository.name;

    if (canDeploy(req, name))
    {
        canDeploy(req, name, () => {
            console.log("No image provided")
        });
    }
    res.status(200).send();
})

app.post('/ci_naboo', (req, res) => {
    const name = req.body.repository.name;

    if (canDeploy(req, name))
    {
        exec("ls -la", (error, stdout, stderr) => {
            if (error)
                console.log(`error: ${error.message}`);
            else if (stderr)
                console.log(`stderr: ${stderr}`);
            else
                console.log(`stdout: ${stdout}`);
        });
    }
    res.status(200).send();
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
    if (!Process.env.CI_BRANCH)
        console.error("[ARKultur] No target branch found!");
    else
        console.error("[ARKultur] Target branch found! (" + Process.env.CI_BRANCH + ")");
});
