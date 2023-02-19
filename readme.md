# Description
This project sets up a CI-Cd pipeline using google cloud build, in which the pipeline is triggered by a commit to the Github repo. The cloud build service will pull the code from repo and create an image using dockerfile, this image is then used to deploy the website on google kubernetes engine

1. A developer pushes the source code to GitHub, which lends itself as the Version Control System.
2. GitHub triggers a post-commit hook to Cloud Build.
3. Cloud Build creates the container image and pushes it to Container Registry.
4. Cloud Build notifies Google Kubernetes Engine to roll out a new deployment.
5. Google Kubernetes Engine pulls the image from Container Registry and runs it.

## File structure
```

├── Readme.md
├── Docs.md
├── cloudbuild.yaml
├── k8
│   ├── deployment.yaml
│   └── service.yaml
└── node-app
├── Dockerfile
├── index.js
├── package-lock.json
├── package.json

```

* Docs.md contains notes related to SRE and DevOps implementation using google* 
* cloudbuild.yaml contains steps to be performed by google cloud build</li
* k8 directory contains the kubernetes files: deployment.yaml and service.yaml* 
* node-app contains index.js which stores the code for our basic project, and a Dockerfile used for creation of images from the code
* The package.json file contains all the dependecies used* 

# Steps

## Step 1: Create a new google cloud project


![image](https://user-images.githubusercontent.com/76873410/179835246-e1158187-82a1-40df-88a8-52288b725a08.png)


* Note the Project-id and Project-number 
* These will be used in the rest of setup and identified as [Project-id] and [Project-number] and need to be replaced with your values
* Run the following command in your terminal, so that you can interact with it from cli* 
``` 
gcloud config set project [project-id] 
```

![image](https://user-images.githubusercontent.com/76873410/179835613-9c5ee98c-a607-4120-a754-2626ba1f3831.png)


## Step 2: Clone the project
``` git clone https://github.com/zigbee-s/gcp-devops-sre.git ```

## Step 3: Build the Dockerfile
``` docker build -t gcr.io/[Project-id]/node-app:latest . ```

## Step 4: Enable the required API's
``` 
gcloud services enable containerregistry.googleapis.com       [to enable Google’s Container Registry API]
gcloud services enable container.googleapis.com               [to enable Google’s Kubernetes Engine API]
gcloud services enable cloudbuild.googleapis.com              [to enable the Cloud Build API]
```

## Step 5: Create a Kubernetes cluster
Run the following command in your terminal 
```
gcloud container clusters create gke-node-app \
--zone=europe-west1-d \
--machine-type=n1-standard-2 \
--enable-autoscaling \
--min-nodes=1 \
--max-nodes=3
```

## Step 6: Add IAM Policy for the cloudbuild to access other services
Run the following command in your terminal 
```
gcloud projects add-iam-policy-binding [PROJECT-ID] \
--member='serviceAccount:[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com' \
--role='roles/container.admin'
```

## Step 7: Go to cloud build service in gcp console

* Navigate to cloud build, select trigger and click on Connect repository*  
* Select github as the source* 
* Select the GitHub account, repository and click on Connect Repository:* 


![image](https://user-images.githubusercontent.com/76873410/179836837-9a77bb5c-291f-4160-9bdc-ceff4b960972.png)



## Step 8: Update cloudbuild.yaml with your [Project-id] and [Project-number]

## Step 9: Create the cloud build trigger
Run the following command in your terminal 
```
gcloud beta builds triggers create github \
--name=[Github Repo name] \
--description="Push to branch" \
--repo-name=[Github Repo name] \
--repo-owner=[Github Owner name] \
--branch-pattern="^main$" \
--build-config=cloudbuild.yaml
```

## Step 10: Run the trigger
You will see something like this: 

![image](https://user-images.githubusercontent.com/76873410/179837552-eb2448d7-442d-4130-b70d-3b5060f3e972.png)

## Step 11: Get endpoint to the website deployed on kubernetes cluster
Run the following command in your terminal 
```
kubectl get svc
```

![image](https://user-images.githubusercontent.com/76873410/179837790-9a7e1d1f-25ac-47d9-8196-446507caf9b2.png)

![image](https://user-images.githubusercontent.com/76873410/179837819-fd3e035f-e06d-4480-90cf-3d107f988ebd.png)



