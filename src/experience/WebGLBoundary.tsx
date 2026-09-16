"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

export class WebGLBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Hayati WebGL experience failed; scenic fallback remains visible.", error, info);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
