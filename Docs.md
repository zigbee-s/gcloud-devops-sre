<h2>Google Devops And SRE</h2>
<h3>SRE</h3>
<ul>
    <li>SLI/SLO/SLA</li>
    <li>SLO: Agreed-upom bounds how often SLIs must be met</li>
    <li>Batch Throuhput: Proportion of time = data processing rate > than a threshold</li>
    <li>Google's Four Golden Signals for SLI<li>
        <ol>
            <li>Latency</li>
            <li>Errors</li>
            <li>Traffic</li>
            <li>Saturation: A measure of how close service's resources are to being fully utilized</li>
        </ol>
    <li>For SLI's you ushould collect data at Load Balancer, as it is most efficient and closer to user's experience</li>
    <li>SLI <= SLO</li>
    <li>(lower bound <= SLI <= upper bound) = SLO</li>
</ul>
<h3>Making the most of the risk</h3>
<ul>
    <li>Balance innovation and reliability</li>
    <li>Helps in improving performance</li>
    <li>Error budget: A quantitave measurement shared between the product and SRE trams to balance innovation and stability</li>
    <li>Error budget = 100 - SLO</li>
    <li>Work tied to running a production service that tends to be manual, repetetive, automatable, tactical, and that scales linearly as a service grows</li>
</ul>
<h3>Generating SRE Metrics</h3>
<ul>
    <li>White-box monitoring: Metrics that are exposed by the internals of the system. It focusses on predicting problems</li>
    <li>Black-box monitoring: Testing externallly visible behaviour as a user would see it. It is Symtom-orriented, active problems</li>
</ul>
<h3>Reacting to incidents</h3>
<ul>
    <li>Separation of responsibilities</li>
    <li>Established command post</li>
    <li>Live incident State Document</li>
    <li>Cleat, Real-Time Handoff</li>
    <li>After resolving the issue, creating a healthy postmortem culture. Share this with all the stakeholder</li>
</ul>
<h3>CI/CD Pipelines</h3>
<ul>
    <li>CI: All developers merge code changes in a central repository multiple times a day</li>
    <li>CD: Adds the practice of automating entire software release process</li>
    <li>Allow users to get new features quicker</li>
    <li>Dramatically easier to find and remove bugs</li>
</ul>
<h3> CI/CD Data flow</h3>
<ul>
    <li>Integrate code in the codebase</li>
    <li>Create a new build</li>
    <li>After testing build becomes Deployable build</li>
    <li>If approved can be Deployed to running system</li>
    <li>User provides feedback, and the good beedback is sorted out</li>
    <li>Developers work on the new featurres from feedback, and again integrate the code, thus continuing the cycle</li>
</ul>
<h3>CI/CD in the google cloud</h3>
<ul>
    <li>Two parts: CI/CD And Production (Can be on different clouds)</li>
    <li>Code pushed to Cloud Source repository</li>
    <li>Code ommit triggers cloud build, cloud build runs various steps to create a deployable build stored in the container registry</li>
    <li>When the above step is complete the cloud build publishes a message to a Topic using Pub/Sub service which further notifies the spinaker that a build is ready </li>
    <li>Then spinaker then sets up a build to be deployed by kubernetes engine</li>
</ul>
<h3>CI</h3>
<ul>
    <li>Submit smaller code changes frequently</li>
    <li>Single shared Code Repo (Gcloud Source Repositories / Github / Bit bucket)</li>
    <li>Automated build & Test tools (GCoud Build / Jenkins)</li>
    <li>Artifact repository (Stores built and tested code) (Container Registry /Docker hub)</li>
</ul>
<h3>1. CLoud Source Repositories</h3>
<ul>
    <li>Fully managed private git repo (Build, test, deploy and debug codde right away)</li>
    <li>Native GCP Integration</li>
    <li>Sync Third-Party repos</li>
    <li>Powerful code search</li>
    <li>IAM ROles: source.admin, source.writer, source.reader (Level at which these are applied can be changed like @Project level, @Repo level)
</ul>
<h3>2. Automating with Cloud build</h3>
<ul>
    <li>A serverless CI/CD Platform</li>
    <li>Usualy started by trigger</li>
    <li>Supports mutli-cloud and local</li>
    <li>Creates artifacts: Docker images, GO applications, Java archives, Etc</li>
    <li>Utilizes cloud builders: Container images that run build process</li>
    <li>Authenticate to GKE by assigning container.developer role to Cloud Build service account</li>
    <li>Cloud build utilizes a configuration file this could be build file or a docker file</li>
    <li>Build file: YAML or JSON Format named cloudbuild.yaml or cloudbuild.json</li>
    <li>Docker file: Directly handles the build steps, Pushes to container registry, Add -tag option to build command</li>
</ul>
<h3>3. Container Registry / Arifcat Registry</h3>
<ul>
    <li>Container registry ony stores containers, while artifact registry can store artifacts in different formats</li>
    <li>Container registry uses cloud storage at the backend</li>
    <li>Artifact registry doesn't use cloud storage</li>
    <li>For container registry we use storace IAM roles, Push images = Storage Pbject Admin, Pull images = Storage object Viewer</li>
    <li></li>
</ul>
<h3>4. Continuous deployment using GKE</h3>
<ul>
    <li>Blue/Green Deploymnet: Run two identical production env, but only one is live</li>
    <li>Canary Deployment: Deploy production update to small subsets of users, Useful for risky updates, traffic split into different versions </li>
    <li>For blur/green intially the blue is running, and the switch is made by modifying Load Balancer yaml file (Uses two yaml files)</li>
    <li>For canary deployment: two files app.yaml and canary.yaml, usually having different replica counts</li>
    <li>Examples of deployment tools: Jenkins, Travis CI, Cloud build, Spinnaker</li>
</ul>
<h3>Working with Spinnaker</h3>
<ul>
    <li>Open source, multi-cloud apllication managment tool</li>
    <li>Manages application deployment</li>
    <li>It creates the YAML file and executes it</li>
    <li>Update replica sets, Create and executes YAML files for load balancers as a service</li>
    <li>Spinnaker is installed on a kubernetes cluster, sets up the necessary authentication with cloud IAM, uses redis database on cloud memory store and also uses cloud storage bucket</li>
    <li>Spinnaker watches a topic on the Pub/Sub, and is triggered through that</li>
</ul>
<h3>Securing the deployment pipeline</h3>
<ul>
    <li>Analyze containers in container registry for vulnerabilities</li>
    <li>Scans based on Freshness, Levels, Support</li>
    <li>Binary authentication is used to control images that are run on the kubernetes cluster</li>
    <li>Whene binary authentication is enabled it applies a policy that checks against several rules</li>
    <li>Attesterr image checks of the new image is authentic or not</li>
</ul>
<h3>What is ops ?</h3>
<ul>
    <li>OPS: monitor, troubleshoot, and improve application performance on your Google Cloud environment</li>
    <ol>
        <li>gatger logs, metrics and trace everywhere</li>
        <li>Dashboard for built-in and customizable visualizations</li>
        <li>Metric query and tracing analysis</li>
        <li>Establish performance and reliability indicators</li>
        <li>Trigger alert and error reporting</li>
    </ol>
</ul>
<h3>Monitoring is critical for sre to establsih SLI, SLO</h3>
<ul>
    <li>Logging</li>
    <li>Using logs</li>
    <li>Reporting errors</li>
    <li>Cloud monitoring: Provides visibility into the performance, uptime, and overall health of cloud applications</li>
    <li>Cloud logging: Allows you to store, search, analyze, monitor, and alert on log data</li>
    <li>Cloud Debugger</li>
</ul>
<h3>Cloud Monitoring Concepts</h3>
<ul>
    <li>Workdpaces</li>
    <ol>
        <li>GCP's tool for monitoring GCP and AWS resources under a single pane</li>
        <li>All monitoring tools live in a workspace</li>
        <li>A workspace can host one pr more projects, but one project can ahve only one workspace</li>
        <li>Project's can be moved from one workspace to other workspace</li>
        <li>Represents project data in cisual manner</li>
    </ol>
    <li>Installed agents</li>
    <ol>
        <li>Two agents: Monitoring agent(collectd), Logging agent(fluentd)</li>
        <li>Helps in pulling data from 3rd party services</li>
        <li>Kubernetes engine is natively integrated with both cloud monitoring and logging</li>
    </ol>
    <li>Alerts</li>
</ul>
<h3>Cloud logging</h3>
<ul>
    <li>Reading and writong long entries</li>
    <li>Query logs</li>
    <li>Export to another service</li>
    <li>Create metrics from logs</li>
    <li>logs are used by othe cloud services</li>
    <li>Services</li>
        <ol>
            <li>Logging viewer</li>
            <li>Logging configuration writer</li>
        </ol>
    <li>Security logs</li>
    <li>Non-security logs</li>
    <li>Always enabled logs (Audit logs, system event</li>
</ul>
<h3>Leveraging logs</h3>
<ul>
    <li>VPC Flow Logs</li>
    <ol>
        <li>Manually enabled logs(Detained by default for 30 days)</li>
        <li>Used for network monitoring, forensics</li>
        <li>Enabled at VPC subnet level</li>
    </ol>
    <li>Firewall logs</li>
    <ol>
        <li>Logs of firewall rule effects</li>
        <li>Applied per pirewall rule, across entire VPC</li>
    </ol>
    <li>Routing and exporting logs</li>
    <ol>
        <li>Route a copy of logs to somewhere else like cloud storage, Big Query, Pub/Sub, anothe google cloud project</li>
        <li>Useful for compliance requirements of storing logs </li>
        <li>Useful t perform big query analysis</li>
        <li>Other application might need logs</li>
        <li>To export a log</li>
            <ol>
                <li>Create a sink</li>
                <li>Create a filter</li>
                <li>Create a destination</li>
            </ol>
    </ol>
</ul>
<h3>Alert parameters</h3>
<ul>
    <li>Precision</li>
    <li>Detection time</li>
    <li>Recall</li>
    <li>Reset time</li>
    <li>Window length: How long is an event measured</li>
    <li>Duration: How long something exceeds SLIs before significant event is declared</li>
</ul>
<h3>Cloud Trace (Useful in understanding Apllication efficiency)</h3>
<ul>
    <li>A distributed tracing system that collects latenct data from your applications and displays in the Google Cloud Console</li>
</ul>
<h3>Cloud Profiler (Useful in understanding Apllication efficiency)</h3>
<ul>
    <li>Continuosuly analyzes the performance of CPU or memory-intensive functions executed across an application</li>
    <li>Agent based</li>
    <li>Profiles saved for thirty days</li>
</ul>
<h3>CLoud Debugger</h3>
<ul>
    <li>Two ways snapshots(Captures application state at a splecific line location) and logpoints(Inject logs into running apps without redeploying) </li>