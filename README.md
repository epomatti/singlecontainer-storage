# Single container with Mounted storage

An application to test Azure WebApp with Single Container deployment mounting a Blob Storage container path.

Requirements:
- Docker
- Azure CLI
- Azure Subscription

## Run it

#### Node

Create the `.env` file with the path to the local storage path:

```sh
touch .env
echo STORAGE=<STORAGE PATH> >> .env
```

Get dependencies and start Node:

```sh
npm i
node server.js
```

To test it, go to `http://localhost:8080/<file_name>`. The program will print the content of the file from the `STORAGE` parameter.

#### Docker

Build and push the docker image:

```sh
docker build -t <your username>/node-web-app .
docker run -p 8080:8080 -v <local-dir>:<dotenv-storage-path> -d <your username>/node-web-app
```

You should be able test it again at this point.

#### Azure

Once you tested your app locally, and against docker runtime, it is ready to run on Azure:

```sh
# set common resource parameters
export group='myResourceGroup'
export location='brazilsouth'
export acr='myContainerRegistry'
export image='yourname/node-web-app'
export tag='yourname.azurecr.io/node-web-app'
export storageAccount='myStoragAccount'
export storageContainer='myfiles'
export localFilePath='/tmp/myfiles/myfile.txt'
export blobName='myfile.txt'
export plan='myPlan'
export webapp='myApp'
export storageMountId='storageMountId'
export storageMountPath='/tmp/myfiles'

# create the image registry
az login
az group create -n $group -l $location
az acr create -n $acr -g $group --sku Basic --admin-enabled true
az acr login -n $acr

# push the docker image
docker tag $image $tag
docker push $tag

# create the storage
az storage account create -n $storageAccount -g $group -l $location --kind StorageV2 --sku Standard_LRS
export key=$(az storage account keys list -n $storageAccount --query "[?keyName == 'key1'].value" -o tsv)
az storage container create -n $storageContainer --account-name $storageAccount --account-key $key

# upload a file
az storage blob upload -c $storageContainer -f $localFilePath -n $blobName --account-name $storageAccount --account-key $key

# create the Web App
az appservice plan create -n $plan -g $group -l $location --is-linux
az webapp create -g $group -p $plan -n $webapp -i $tag
az webapp config storage-account add -k $key -a $storageAccount -i $storageMountId --sn $storageContainer -t AzureBlob -m $storageMountPath -n $webapp --resource-group $group
```

After you finish working, clean your resources:

```sh
az group delete -n $group
```

## Reference

[Dockerizing a Node.js web app](1)

[1]: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
