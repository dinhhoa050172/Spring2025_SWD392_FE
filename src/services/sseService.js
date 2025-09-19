let eventSource = null;

const connect = (userId, callback) => {
  // Close any existing connection
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  // Create new SSE connection with proper URL formatting
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const url = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}api/sse/subscribe/${userId}`;
  
  try {
    eventSource = new EventSource(url);
    
    // Handle connection open
    eventSource.onopen = (event) => {
      console.log("SSE connection established ", event);
    };

    // Handle events from server with better error handling
    eventSource.onmessage = (event) => {
      try {
        // Log raw data for debugging
        console.debug("Received SSE data:", event.data);
        
        // Validate data before parsing
        if (!event.data) {
          throw new Error("Empty data received");
        }
        
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error("Error parsing SSE data:", error, "Raw data:", event.data);
        callback({
          name: "message",
          data: event.data ? event.data : "Empty data",
          error: true
        });
      }
    };

    // Handle named events (like "logout") with improved error handling
    eventSource.addEventListener("logout", (event) => {
      console.log("Received logout event");
      try {
        const data = JSON.parse(event.data);
        callback({
          name: "logout",
          data,
        });
      } catch (error) {
        console.error("Error parsing logout event:", error);
        callback({
          name: "logout",
          data: event.data ? event.data : "Empty data",
          error: true
        });
      }
    });

    // Handle errors with reconnection logic
    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      
      // Try to reconnect after a delay if the connection is lost
      if (eventSource && eventSource.readyState === EventSource.CLOSED) {
        console.log("Connection closed, attempting to reconnect in 5 seconds");
        setTimeout(() => connect(userId, callback), 5000);
      }
    };

    return eventSource;
  } catch (error) {
    console.error("Failed to establish SSE connection:", error);
    return null;
  }
};

const disconnect = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log("SSE connection closed");
  }
};

export default {
  connect,
  disconnect,
};
