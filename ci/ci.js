const express = require('express');
const Process = require("process");
const { exec } = require("child_process");
const app = express();
const port = 4567;

app.use(express.json())

function prefix(name)
{
    return "[" + name + "] ";
}

function isWorkflowEnd(req, name)
{
    const status = req.body.workflow_run.status;
    const conclusion = req.body.workflow_run.conclusion;
    const actionName = req.body.workflow_run.name;

    if (actionName !== "Docker")
        return false;
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
            console.log(prefix(name) + "Starting deploying with branch " + branch + "...");
            callback();
            return true;
        }
    }
    return false;
}

app.post('/payload', (req, res) => {
    const name = req.body.repository.name;
    const port = 8080;

    canDeploy(req, name, () => { console.log("Nothing to deploy it's just a test!")
        exec("./ci/script/deploy.sh naboo dev " + port, (error, stdout, stderr) => {
            if (error)
                console.log(`error: ${error.message}`);
            else if (stderr)
                console.log(`stderr: ${stderr}`);
            else
                console.log(`stdout: ${stdout}`);
        });});
    res.status(200).send();
});

app.post('/ci_deploy', (req, res) => {
    console.info(prefix("ARKultur") + "Endpoint: /ci_deploy targeted");
    const name = req.body.repository.name;
    if (!req.body.workflow_run) {
        console.info(prefix("ARKultur") + "Not a workflow event");
        res.status(200).send();
        return;
    }
    const branch = req.body.workflow_run.head_branch;

    if (canDeploy(req, name))
    {
        exec("./ci/script/deploy.sh " + name + " " + branch, (error, stdout, stderr) => {
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

app.get('/ci_deploy/ping', (req, res) => {
    console.info(prefix("ARKultur") + "Endpoint: /ci_deploy/ping targeted");
    res.status(200).send({message: "Pong"});
})

app.listen(port, () => {
    console.log(prefix("ARKultur") + "Now listening on port " + port);
    if (!Process.env.CI_BRANCH)
        console.error(prefix("ARKultur") + "No target branch found!");
    else
        console.error(prefix("ARKultur") + "Target branch found! (" + Process.env.CI_BRANCH + ")");
});
