import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App crash caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            color: "#fff",
            background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
          }}
        >
          <h2 style={{ margin: 0 }}>Что-то пошло не так</h2>
          <p style={{ margin: 0, opacity: 0.8, textAlign: "center" }}>
            Приложение не смогло загрузиться. Попробуйте обновить страницу.
          </p>
          {this.state.error && (
            <pre
              style={{
                background: "rgba(0,0,0,0.3)",
                padding: 16,
                borderRadius: 8,
                maxWidth: 600,
                width: "100%",
                overflowX: "auto",
                fontSize: 12,
                color: "#fca5a5",
              }}
            >
              {String(this.state.error)}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#1d4ed8",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
