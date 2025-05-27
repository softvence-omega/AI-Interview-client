import { Component } from "react";

class ErrorBoundary extends Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    render() {
      if (this.state.hasError) {
        return (
          <div className="text-red-500 p-4">
            <h3>Something went wrong:</h3>
            <p>{this.state.error?.message || "Unknown error"}</p>
          </div>
        );
      }
      return this.props.children;
    }
  }

  export default ErrorBoundary