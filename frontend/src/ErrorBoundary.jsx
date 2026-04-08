import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-red-900 z-50 text-white p-10 font-mono overflow-auto">
          <h1 className="text-3xl font-bold mb-4">React App Crashed!</h1>
          <p className="text-xl mb-4">{this.state.error?.toString()}</p>
          <pre className="bg-black/50 p-4 rounded text-sm">
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
