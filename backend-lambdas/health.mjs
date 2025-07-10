export const handler = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      status: "healthy", 
      timestamp: new Date().toISOString(), 
      service: "CogniWeave Backend",
      version: "1.0.0",
    }),
  };
  return response;
};

