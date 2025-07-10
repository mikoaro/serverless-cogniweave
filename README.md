# CogniWeave Cognitive Accessibility Engine

CogniWeave is a revolutionary web application, powered directly by AWS Lambda and Amazon Bedrock, that breaks down barriers to digital understanding. It transforms complex text into clear, easy-to-read content personalized to a user's unique cognitive needs.

## 🏛️ Architecture Overview

CogniWeave is a fully serverless, API-driven web application. The architecture is designed for simplicity, scalability, and performance.

![Solution Architecture Diagram](./screenshots/1-cogniweave-architecture.png)

#### Core Data Flow:

1.  **Frontend (Next.js):** The user pastes text into the web application.
2.  **API Gateway:** The frontend calls a secure REST API endpoint.
3.  **AWS Lambda:** A `TransformContent` Lambda function is triggered.
4.  **DynamoDB & Bedrock:** The Lambda function retrieves the user's cognitive profile from DynamoDB, constructs a detailed prompt, and calls Amazon Bedrock (with Claude 3.5 Sonnet) to perform the text simplification.
5.  **Response:** The simplified text is returned synchronously to the user.

-----

## 🛠️ Tech Stack

The project leverages a modern, performant, and scalable technology stack.

| Area | Technology / Service | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [React 19](https://react.dev/blog/2024/04/25/react-19) | Web application framework and UI library. |
| **Backend** | [AWS Lambda](https://aws.amazon.com/lambda/features/) | Serverless compute for core application logic. |
| | [Amazon API Gateway](https://aws.amazon.com/api-gateway/features/) | Secure and scalable API management. |
| | [Amazon DynamoDB](https://aws.amazon.com/dynamodb/features/) | NoSQL database for user profile storage. |
| **AI Layer** | [Amazon Bedrock](https://aws.amazon.com/bedrock/features/) | Managed service for generative AI models. |
| | [Anthropic Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet) | Foundation Model for intelligent text transformation. |

-----

## 🚀 Getting Started

Follow these instructions to get the CogniWeave application running on your local machine for development and testing.

### Prerequisites

  * An [AWS Account](https://aws.amazon.com/free/) and configured credentials.
  * [Node.js](https://nodejs.org/) (latest LTS version)
  * [pnpm](https://pnpm.io/) package manager
  * [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) or [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) installed (depending on the IaC choice).

### Installation & Setup

#### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/cogniweave-app.git
cd cogniweave-app
```

#### 2\. Deploy the Backend

The backend infrastructure is managed by AWS Management Console. Navigate to the backend directory and deploy the services via the AWS Management Console.

```bash
cd backend/
```

This will provision the API Gateway, Lambda functions, DynamoDB table, and necessary IAM roles. **Note the `ApiGatewayEndpoint` URL from the deployment output.**

#### 3\. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory. Add the API Gateway endpoint URL from the previous step.

```env
# frontend/.env.local

NEXT_PUBLIC_API_GATEWAY_URL="<Your-ApiGatewayEndpoint-URL>"
```

#### 4\. Install Frontend Dependencies

Navigate to the frontend directory and install the required packages.

```bash
cd ../frontend/
pnpm install
```

### Running the Application

#### 1\. Start the Frontend Development Server

From the `frontend/` directory, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

#### 2\. Backend

The serverless backend is now live on AWS and will be invoked automatically by the frontend application. There is no local backend server to run.

-----

## 🔌 API Endpoints

The application uses a simple REST API to communicate with the serverless backend.

### Create User Profile

  - **Endpoint:** `POST /users`
  - **Description:** Creates a new user profile based on onboarding answers.
  - **Sample Body:**
    ```json
    {
      "userId": "user-12345",
      "preferences": {
        "reading_preference": "short_sentences",
        "vocabulary_level": "simple"
      }
    }
    ```

### Transform Text

  - **Endpoint:** `POST /transform`
  - **Description:** The core function that simplifies a block of text based on the user's stored profile.
  - **Sample Body:**
    ```json
    {
      "userId": "user-12345",
      "text_content": "The intricate mechanism of cellular respiration involves a series of metabolic reactions and processes that take place in the cells of organisms to convert chemical energy..."
    }
    ```
  - **Success Response:**
    ```json
    {
      "simplifiedText": "Cellular respiration is a process in cells that turns chemical energy from nutrients into a substance called ATP. This process also releases waste products."
    }
    ```

