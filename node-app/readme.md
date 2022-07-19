<h2>Description</h2>
This project sets up a CI-Cd pipeline using google cloud build, in which the pipeline is triggered by a commit to the Github repo. The cloud build service will pull the code from repo and create an image using dockerfile, this image is then used to deploy the website on google kubernetes engine

<ol>
  <li>A developer pushes the source code to GitHub, which lends itself as the Version Control System.</li>
  <li>GitHub triggers a post-commit hook to Cloud Build.</li>
  <li>Cloud Build creates the container image and pushes it to Container Registry.</li>
  <li>Cloud Build notifies Google Kubernetes Engine to roll out a new deployment.</li>
  <li>Google Kubernetes Engine pulls the image from Container Registry and runs it.</li>
</ol>
<h3>File structure</h3>
<pre>

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
    
</pre>
<ul>
  <li>Docs.md contains notes related to SRE and DevOps implementation using google</li>
  <li>cloudbuild.yaml contains steps to be performed by google cloud build</li
  <li>k8 directory contains the kubernetes files: deployment.yaml and service.yaml<li>
  <li>node-app contains index.js which stores the code for our basic project, and a Dockerfile used for creation of images from the code</li>
  <li>The package.json file contains all the dependecies used</li>
  
  <h2>Steps</h2>
  <h3>Step 1: Create a new google cloud project<h3>
    ![image](https://user-images.githubusercontent.com/76873410/179835246-e1158187-82a1-40df-88a8-52288b725a08.png)

    <ul>
      <li>Note the Project-id and Project-number 
      <li>These will be used in the rest of setup and identified as [Project-id] and [Project-number] and need to be replaced with your values
      <li>Run the following command in your terminal, so that you can interact with it from cli</li>
      <pre> gcloud config set project [project-id] <pre>
      ![image](https://user-images.githubusercontent.com/76873410/179835613-9c5ee98c-a607-4120-a754-2626ba1f3831.png)
    </ul>
        
  <h3>Step 2: Clone the project</h3>
  <pre> git clone https://github.com/zigbee-s/gcloud-devops-sre.git </pre>
  
  <h3>Step 3: Build the Dockerfile</h3>
  <pre> docker build -t gcr.io/[Project-id]/node-app:latest . </pre>
  
  <h3>Step 4: Enable the required API's</h3>
  <pre> 
  gcloud services enable containerregistry.googleapis.com       [to enable Google’s Container Registry API]
  gcloud services enable container.googleapis.com               [to enable Google’s Kubernetes Engine API]
  gcloud services enable cloudbuild.googleapis.com              [to enable the Cloud Build API]
  </pre>
  
  <h3>Step 5: Create a Kubernetes cluster</h3>
  <span>Run the following command in your terminal </span>
  <pre>
  gcloud container clusters create gke-node-app \
  --zone=europe-west1-d \
  --machine-type=n1-standard-2 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=3
  </pre>
  
  <h3>Step 6: Add IAM Policy for the cloudbuild to access other services</h3>
  <span>Run the following command in your terminal </span>
  <pre>
  gcloud projects add-iam-policy-binding [PROJECT-ID] \
  --member='serviceAccount:[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com' \
  --role='roles/container.admin'
  </pre>
  
  <h3>Step 7: Go to cloud build service in gcp console</h3>
  <ul>
    <li>Navigate to cloud build, select trigger and click on Connect repository</li> 
    <li>Select github as the source</li>
    <li>Select the GitHub account, repository and click on Connect Repository:</li>
    ![image](https://user-images.githubusercontent.com/76873410/179836837-9a77bb5c-291f-4160-9bdc-ceff4b960972.png)
  </ul>
  
  <h3>Step 8: Update cloudbuild.yaml with your [Project-id] and [Project-number]</h3>
  
  <h3>Step 9: Create the cloud build trigger</h3>
  <span>Run the following command in your terminal </span>
  <pre>
  gcloud beta builds triggers create github \
  --name=[Github Repo name] \
  --description="Push to branch" \
  --repo-name=[Github Repo name] \
  --repo-owner=[Github Owner name] \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
  </pre>
  
  <h3>Step 10: Run the trigger</h3>
  <span> You will see something like this: </span>
  ![image](https://user-images.githubusercontent.com/76873410/179837552-eb2448d7-442d-4130-b70d-3b5060f3e972.png)

  <h3>Step 11: Get endpoint to the website deployed on kubernetes cluster</h3>
  <span>Run the following command in your terminal </span>
  <pre>
    kubectl get svc
  </pre>
  ![image](https://user-images.githubusercontent.com/76873410/179837790-9a7e1d1f-25ac-47d9-8196-446507caf9b2.png)

  ![image](https://user-images.githubusercontent.com/76873410/179837819-fd3e035f-e06d-4480-90cf-3d107f988ebd.png)

  

  
  
