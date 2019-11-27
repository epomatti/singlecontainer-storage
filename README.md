# Single container + mounted storage

An application to test Azure WebApp with Single Container deployment mounting a Blob Storage container path.

Requirements:
- Docker
- Azure CLI
- Azure Subscription

## Run it

#### Node

Create the `.env` file with the path to the local storage path:

```s
touch .env
echo STORAGE=<STORAGE PATH> >> .env
```

Get dependencies and start Node:

```s
npm i
node server.js
```

To test it, go to `http://localhost:8080/<file_name>`. The program will print the content of the file from the `STORAGE` parameter.

#### Docker

Build and push the docker image:

```s
docker build -t <your username>/node-web-app .
docker run -p 8080:8080 -v <local-dir>:<dotenv-storage-path> -d evandropomatti/node-web-app
```

You should be able test it again at this point.

#### Azure

Create the image registry:

```s
az login
az group create -n <group> -l <location>
az acr create -n <name> -g <group> --sku Basic --admin-enabled true
az acr login -n <name>
```

Push the docker image:

```s
docker tag <localname>/node-web-app <name>.azurecr.io/node-web-app
sudo docker push <name>.azurecr.io/node-web-app
```

Create the storage:

```s
az storage account create -n <name> -g <group> -l <location> --kind StorageV2 --sku Standard_LRS
az storage account keys list -g <group> -n <name>
az storage container create -n <name> --account-name <account-name> --account-key <key>
```

Upload a file:

```s
az storage blob upload -c <container> -f <local-file> -n <blob-name> --account-name <account-name> --account-key <account-key>
```

Create the Web App:

```s
az appservice plan create -n <plan-name> -g <group> -l <location> --sku F1
az acr credential show -n <registry-name>
az webapp create -n <app-name> -p <plan-name> -g <group> -location <location> -i <image-name> -s <registry-user> -w <registry-password>

az webapp config storage-account add -a pomattistorage -k qvqDtX2FkVqb+s615s68g2kiHxdKSxezPPzvvbF+ilQLKno7yG5fJM/ldhiGmnV91K7K2N2GlJGl9VZT8Ld3dA== -i awsomefiles -sn /tmp/awsomefiles -t AzureBlob -m /


```


## Purge resources

After you are done with your tests don't forget to clean up:

```s
az group delete -n <group>
```

## Reference

[Dockerizing a Node.js web app](1)

[1]: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/