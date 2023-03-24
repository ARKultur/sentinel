# Sentinel

### Setup

Clone the repo on your server, then define these environment variables:
```
CI_BRANCH       - Target branch to automaticly deploy a projet (ex: main, develop)
SITE_DOMAIN     - Domain name of the projet (ex: arktest.example.com)
SITE_ADDRESS    - Current address of the server where the CI are (ex: 145.144.67.98)  
```

### Start

Then when you have defined these variable you can juste run the command:
```shell
./start.sh
```
It will start all instance of ARKultur based on the target branch `CI_BRANCH`.

### Stop
If you want to stop the CI you can run the command:
```shell
./stop.sh
```
This command stop all instance (it doesn't remove anything).

### Configure auto deploy
When you run the command `./start.sh` the server who, auto deploy it also started, but 
you have to link it with a GitHub webhook.
To do so go to:
- Repo's settings
- Webhooks
- Create a new one
- Content type: `application/json`
- Check: `Let me select individual events.`
- Uncheck: everything
- Check: `Workflow runs`

For the payload in caddy's config we've set a route called `ci_deploy/`. \
Add your server address (domain or IP) before this route (ex: https://example.com/ci_deploy). \
Then save your change and check if the ping work. \
If the configuration is good a new version of the project will be deployed when an action
called `docker` id successfully done. \

### Upgrade

If you want to upgrade something in the project there is:
- `docker-compose.yml`: All information about containers
- `configd/`: Contain Caddy's config file
- `ci/`: Server which auto deploy a project