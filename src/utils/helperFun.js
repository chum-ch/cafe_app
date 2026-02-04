export const useSession = {
    // Save data (automatically converts objects/arrays to JSON)
    set(key, value) {
      try {
        const payload = JSON.stringify(value);
        sessionStorage.setItem(key, payload);
      } catch (error) {
        console.error("SessionStorage Set Error:", error);
      }
    },
  
    // Get data (automatically parses JSON back to JS objects)
    get(key) {
      try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("SessionStorage Get Error:", error);
        return null;
      }
    },
  
    // Delete a specific item
    remove(key) {
      sessionStorage.removeItem(key);
    },
  
    // Clear all session data
    clear() {
      sessionStorage.clear();
    }
  };