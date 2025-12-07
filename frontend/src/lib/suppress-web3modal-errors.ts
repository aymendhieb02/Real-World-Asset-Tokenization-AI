/**
 * Suppress Web3Modal/Reown remote config fetch errors
 * This intercepts fetch calls to prevent 403 errors when using a dummy project ID
 */

// Only run on client side
if (typeof window !== "undefined" && typeof fetch !== "undefined") {
  // Store original fetch
  const originalFetch = window.fetch;
  
  // Override fetch to intercept Web3Modal config requests
  window.fetch = async function(...args: Parameters<typeof fetch>): Promise<Response> {
    const url = args[0]?.toString() || "";
    
    // Intercept Web3Modal/Reown config API calls to prevent 403 errors
    if (
      url.includes("api.web3modal.org") || 
      url.includes("cloud.reown.com") ||
      url.includes("/appkit/v1/config") ||
      url.includes("projectId=00000000000000000000000000000000")
    ) {
      // Return a successful mock response to prevent errors
      return Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          statusText: "OK",
          headers: new Headers({ "Content-Type": "application/json" }),
        } as ResponseInit)
      );
    }
    
    // For all other requests, use original fetch
    try {
      return await originalFetch.apply(window, args);
    } catch (error) {
      // Suppress errors related to Web3Modal
      const errorMessage = String(error);
      if (
        errorMessage.includes("api.web3modal.org") ||
        errorMessage.includes("cloud.reown.com")
      ) {
        return Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
            headers: new Headers({ "Content-Type": "application/json" }),
          } as ResponseInit)
        );
      }
      throw error;
    }
  };
}

