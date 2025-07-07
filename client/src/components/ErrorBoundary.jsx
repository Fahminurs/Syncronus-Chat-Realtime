import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Perbarui state untuk menunjukkan bahwa terjadi kesalahan
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Anda bisa mencatat kesalahan ke layanan pelaporan di sini
    console.error("Kesalahan terdeteksi oleh Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render UI cadangan jika terjadi kesalahan
      return <h1>Terjadi kesalahan. Silakan coba lagi nanti.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;